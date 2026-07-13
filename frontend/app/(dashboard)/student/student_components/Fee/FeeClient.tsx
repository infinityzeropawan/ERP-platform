'use client';

import { useState } from 'react';
import { ResourceState } from '@/lib/useResource';
import { CreditCard, CheckCircle, Clock, AlertCircle, Receipt, Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFee, FeeRecord } from '../../student_hooks/useFee';
import '../../student.css';

const statusConfig = {
  paid:    { label: 'Paid',    color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)', icon: CheckCircle },
  pending: { label: 'Pending', color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)', icon: Clock },
  overdue: { label: 'Overdue', color: 'var(--student-danger)',  bg: 'var(--student-danger-bg)',  border: 'var(--student-danger)',  icon: AlertCircle },
};

export default function FeeClient() {
  const { paid, pending, overdue, totalPaid, totalDue, loading, error } = useFee();
  const [receipt, setReceipt] = useState<FeeRecord | null>(null);

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <CreditCard className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Fee & Payments
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Complete fee payment history, dues and receipts</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Paid',    value: `₹${totalPaid.toLocaleString()}`, color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)' },
          { label: 'Total Due',     value: `₹${totalDue.toLocaleString()}`,  color: 'var(--student-danger)',  bg: 'var(--student-danger-bg)',  border: 'var(--student-danger)' },
          { label: 'Paid Invoices', value: String(paid.length),              color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-primary)' },
          { label: 'Pending',       value: String(pending.length + overdue.length), color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)' },
        ].map((s, i) => (
          <div key={s.label} className="border rounded-2xl p-4 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 70}ms`, backgroundColor: s.bg, borderColor: s.border }}>
            <p className="text-xs font-medium" style={{ color: 'var(--student-text-secondary)' }}>{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {[...overdue, ...pending].length > 0 && (
        <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up delay-200" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-danger-bg)' }}>
            <AlertCircle className="h-4 w-4" style={{ color: 'var(--student-danger)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--student-danger)' }}>Pending & Overdue Payments</h3>
          </div>
          <div className="p-5 space-y-3">
            {[...overdue, ...pending].map(f => {
              const cfg = statusConfig[f.status];
              const Icon = cfg.icon;
              return (
                <div key={f.id} className="flex items-center justify-between p-4 rounded-xl border transition-colors card-hover" style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                      <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--student-text-primary)' }}>{f.title}</p>
                      <p className="text-xs" style={{ color: 'var(--student-text-secondary)' }}>Due: {new Date(f.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold" style={{ color: 'var(--student-text-primary)' }}>₹{f.amount.toLocaleString()}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
            <button className="w-full py-3 text-white rounded-xl font-semibold text-sm transition-all shadow-lg mt-2" style={{ backgroundColor: 'var(--student-primary)' }}>
              Pay Now — ₹{totalDue.toLocaleString()}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up delay-300" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-page)' }}>
          <Receipt className="h-4 w-4" style={{ color: 'var(--student-primary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--student-text-primary)' }}>Payment History</h3>
          <span className="ml-auto text-xs" style={{ color: 'var(--student-text-disabled)' }}>Click receipt to download</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--student-border)' }}>
          {[...paid].reverse().map((f, i) => (
            <div key={f.id} className="flex items-center justify-between px-5 py-4 transition-colors animate-fade-in hover:opacity-80" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--student-success-bg)' }}>
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--student-success)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--student-text-primary)' }}>{f.title}</p>
                  <p className="text-xs" style={{ color: 'var(--student-text-secondary)' }}>Paid: {f.paidDate ? new Date(f.paidDate).toLocaleDateString() : '—'} · {f.paymentMode} · {f.receiptNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-base font-bold" style={{ color: 'var(--student-success)' }}>₹{f.amount.toLocaleString()}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--student-success-bg)', color: 'var(--student-success)', borderColor: 'var(--student-success)' }}>Paid</span>
                </div>
                <button onClick={() => setReceipt(f)}
                  className="p-2 rounded-xl transition-colors" title="View Receipt" style={{ backgroundColor: 'var(--student-primary-subtle)', color: 'var(--student-primary)' }}>
                  <Receipt className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!receipt} onOpenChange={v => { if (!v) setReceipt(null); }}>
        <DialogContent className="max-w-md" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
              <Receipt className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />Payment Receipt
            </DialogTitle>
          </DialogHeader>
          {receipt && (
            <DialogBody className="p-0">
              <div className="mx-6 my-5 border-2 rounded-2xl overflow-hidden" style={{ borderColor: 'var(--student-border)' }}>
                <div className="px-5 py-4 text-white text-center" style={{ backgroundColor: 'var(--student-primary)' }}>
                  <p className="text-xs uppercase tracking-widest opacity-80">Buildroonix Institute</p>
                  <h2 className="text-lg font-bold mt-1">PAYMENT RECEIPT</h2>
                  <p className="text-sm font-mono opacity-90">{receipt.receiptNo}</p>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--student-border)' }}>
                  {[
                    { label: 'Student Name',    value: 'Aarav Sharma' },
                    { label: 'Roll Number',     value: '001' },
                    { label: 'Class',           value: 'IOT-2026 · Evening' },
                    { label: 'Fee Description', value: receipt.title },
                    { label: 'Amount Paid',     value: `₹${receipt.amount.toLocaleString()}` },
                    { label: 'Payment Date',    value: receipt.paidDate || '—' },
                    { label: 'Payment Mode',    value: receipt.paymentMode || '—' },
                    { label: 'Receipt No.',     value: receipt.receiptNo || '—' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-2.5">
                      <span className="text-xs" style={{ color: 'var(--student-text-secondary)' }}>{row.label}</span>
                      <span className={`text-sm font-semibold ${row.label === 'Amount Paid' ? 'text-base' : ''}`} style={{ color: row.label === 'Amount Paid' ? 'var(--student-success)' : 'var(--student-text-primary)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 text-center border-t" style={{ backgroundColor: 'var(--student-success-bg)', borderColor: 'var(--student-border)' }}>
                  <p className="text-xs font-semibold flex items-center justify-center gap-1" style={{ color: 'var(--student-success)' }}>
                    <CheckCircle className="h-3.5 w-3.5" />Payment Verified & Confirmed
                  </p>
                </div>
              </div>
            </DialogBody>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceipt(null)} style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}>Close</Button>
            <Button onClick={() => window.print()} className="flex items-center gap-2" style={{ backgroundColor: 'var(--student-primary)', color: 'white' }}>
              <Printer className="h-4 w-4" />Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
