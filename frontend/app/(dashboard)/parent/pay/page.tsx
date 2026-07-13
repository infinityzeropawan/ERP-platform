'use client';
import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface FeeRecord {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
  description: string;
  paidAt?: string;
}

interface PaymentRecord {
  id: string;
  gateway: string;
  amount: number;
  status: string;
  createdAt: string;
}

declare global {
  interface Window { Razorpay: any; }
}

export default function ParentPayPage() {
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
      fetch('/api/v1/fees').then(r => r.json()),
      fetch('/api/v1/payments/history').then(r => r.json()),
    ]).then(([f, h]) => {
      setFees(Array.isArray(f) ? f : []);
      setHistory(Array.isArray(h) ? h : []);
    }).finally(() => setLoading(false));
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
          theme: { color: '#0d9488' },
          handler: (response: any) => {
            showToast('success', `Payment successful! ID: ${response.razorpay_payment_id}`);
            // Refresh data
            fetch('/api/v1/fees').then(r => r.json()).then(f => setFees(Array.isArray(f) ? f : []));
            fetch('/api/v1/payments/history').then(r => r.json()).then(h => setHistory(Array.isArray(h) ? h : []));
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl text-white font-medium animate-fade-in ${toast.type === 'success' ? 'bg-teal-600' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center gap-3 animate-fade-in">
        <div className="p-2 bg-teal-100 rounded-xl"><CreditCard className="h-6 w-6 text-teal-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Payments</h1>
          <p className="text-sm text-gray-500">View and pay pending fees securely online</p>
        </div>
      </div>

      {/* Pending Fees */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">⚠️ Pending Fees ({pendingFees.length})</h2>
        {pendingFees.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-medium">All fees are paid! You're all clear.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingFees.map(fee => (
              <div key={fee.id} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{fee.description || 'Fee'}</p>
                  <p className="text-sm text-red-600 mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />Due: {new Date(fee.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-gray-900">₹{fee.amount.toLocaleString()}</p>
                  <button onClick={() => handlePay(fee)} disabled={payingId === fee.id}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all disabled:opacity-50 text-sm">
                    {payingId === fee.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">✅ Payment History</h2>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Gateway</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className="capitalize text-gray-700">{p.gateway}</span></td>
                    <td className="px-4 py-3 font-medium text-gray-900">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${p.status === 'paid' ? 'bg-green-100 text-green-700' : p.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.status === 'paid' ? <CheckCircle className="h-3 w-3" /> : p.status === 'failed' ? <XCircle className="h-3 w-3" /> : <Loader2 className="h-3 w-3" />}
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
