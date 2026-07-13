import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

export interface FeeRecord {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
  description: string;
  paidAt?: string;
}

export interface PaymentRecord {
  id: string;
  gateway: string;
  amount: number;
  status: string;
  createdAt: string;
}

declare global {
  interface Window { Razorpay: any; }
}

export function usePay() {
  const { user } = useAuth();
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/fees').then(r => r.ok ? r.json() : []),
      fetch('/api/v1/payments/history').then(r => r.ok ? r.json() : []),
    ])
      .then(([f, h]) => {
        setFees(Array.isArray(f) ? f : []);
        setHistory(Array.isArray(h) ? h : []);
      })
      .catch(err => console.error("Failed to load fee/payment history:", err))
      .finally(() => setLoading(false));
  }, []);

  const pendingFees = fees.filter(f => f.status !== 'paid');
  const paidFees = fees.filter(f => f.status === 'paid');

  const handlePay = async (fee: FeeRecord) => {
    setPayingId(fee.id);
    try {
      // Try Razorpay first
      const r = await fetch('/api/v1/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeRecordId: fee.id, amount: fee.amount, currency: 'INR', gateway: 'razorpay' }),
      });

      if (r.ok) {
        const order = await r.json();
        // Load Razorpay script dynamically
        if (!window.Razorpay) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Razorpay'));
            document.body.appendChild(script);
          });
        }

        const rzp = new window.Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: 'Buildroonix ERP',
          description: fee.description || 'Fee Payment',
          prefill: { name: user?.name, email: user?.email },
          theme: { color: '#6366F1' },
          handler: (response: any) => {
            showToast('success', `Payment successful! ID: ${response.razorpay_payment_id}`);
            // Refresh data
            fetch('/api/v1/fees').then(r => r.ok ? r.json() : []).then(f => setFees(Array.isArray(f) ? f : []));
            fetch('/api/v1/payments/history').then(r => r.ok ? r.json() : []).then(h => setHistory(Array.isArray(h) ? h : []));
          },
        });
        rzp.open();
        setPayingId(null);
        return;
      }

      // Fallback: try Stripe
      const rs = await fetch('/api/v1/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeRecordId: fee.id, amount: fee.amount, currency: 'INR', gateway: 'stripe' }),
      });
      if (!rs.ok) throw new Error('No payment gateway configured. Contact your institution admin.');
      showToast('success', 'Stripe payment initiated — follow the link.');
    } catch (e: any) {
      showToast('error', e.message);
    } finally {
      setPayingId(null);
    }
  };

  return {
    fees,
    history,
    loading,
    payingId,
    toast,
    pendingFees,
    paidFees,
    handlePay
  };
}
