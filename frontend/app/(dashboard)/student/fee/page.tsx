'use client';
import { useState } from 'react';
import { ResourceState, useResource } from '@/lib/useResource';
import { CreditCard, CheckCircle, Clock, AlertCircle, Receipt, Printer, Download, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const statusConfig = {
  paid:    { label: 'Paid',    color: 'text-green-700 bg-green-50 border-green-200',  icon: CheckCircle, iconColor: 'text-green-500' },
  pending: { label: 'Pending', color: 'text-amber-700 bg-amber-50 border-amber-200',  icon: Clock,       iconColor: 'text-amber-500' },
  overdue: { label: 'Overdue', color: 'text-red-700 bg-red-50 border-red-200',        icon: AlertCircle, iconColor: 'text-red-500' },
};
interface FeeRecord {
  id: string; title: string; amount: number; dueDate: string; paidDate?: string;
  status: 'paid' | 'pending' | 'overdue'; receiptNo?: string; paymentMode?: string;
}

export default function StudentFeePage() {
  const { data: feeRecords, loading, error } = useResource<FeeRecord>('fees');
  const [receipt, setReceipt] = useState<FeeRecord | null>(null);
  const paid    = feeRecords.filter(f => f.status === 'paid');
  const pending = feeRecords.filter(f => f.status === 'pending');
  const overdue = feeRecords.filter(f => f.status === 'overdue');
  const totalPaid = paid.reduce((a, f) => a + f.amount, 0);
  const totalDue  = [...pending, ...overdue].reduce((a, f) => a + f.amount, 0);
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-teal-600" />Fee & Payments
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Complete fee payment history, dues and receipts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Paid',    value: `₹${totalPaid.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'Total Due',     value: `₹${totalDue.toLocaleString()}`,  color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200' },
          { label: 'Paid Invoices', value: String(paid.length),              color: 'text-teal-600',  bg: 'bg-teal-50',  border: 'border-teal-200' },
          { label: 'Pending',       value: String(pending.length + overdue.length), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 70}ms` }}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pending / Overdue */}
      {[...overdue, ...pending].length > 0 && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden animate-fade-in-up delay-200">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-red-50 bg-red-50/50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-red-700">Pending & Overdue Payments</h3>
          </div>
          <div className="p-5 space-y-3">
            {[...overdue, ...pending].map(f => {
              const cfg = statusConfig[f.status];
              return (
                <div key={f.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 transition-colors card-hover">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${f.status === 'overdue' ? 'bg-red-100' : 'bg-amber-100'}`}>
                      <cfg.icon className={`h-4 w-4 ${cfg.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                      <p className="text-xs text-gray-400">Due: {new Date(f.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">₹{f.amount.toLocaleString()}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
            <button className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg mt-2">
              Pay Now — ₹{totalDue.toLocaleString()}
            </button>
          </div>
        </div>
      )}

      {/* Payment History with receipt */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-300">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
          <Receipt className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-gray-800">Payment History</h3>
          <span className="ml-auto text-xs text-gray-400">Click receipt to download</span>
        </div>
        <div className="divide-y divide-gray-50">
          {[...paid].reverse().map((f, i) => (
            <div key={f.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-400">Paid: {f.paidDate ? new Date(f.paidDate).toLocaleDateString() : '—'} · {f.paymentMode} · {f.receiptNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-base font-bold text-green-600">₹{f.amount.toLocaleString()}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border text-green-700 bg-green-50 border-green-200">Paid</span>
                </div>
                <button onClick={() => setReceipt(f)}
                  className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-600 transition-colors" title="View Receipt">
                  <Receipt className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={!!receipt} onOpenChange={v => { if (!v) setReceipt(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-teal-600" />Payment Receipt
            </DialogTitle>
          </DialogHeader>
          {receipt && (
            <DialogBody className="p-0">
              <div className="mx-6 my-5 border-2 border-gray-200 rounded-2xl overflow-hidden">
                {/* Receipt header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-5 py-4 text-white text-center">
                  <p className="text-xs text-teal-200 uppercase tracking-widest">Buildroonix Institute</p>
                  <h2 className="text-lg font-bold mt-1">PAYMENT RECEIPT</h2>
                  <p className="text-sm text-teal-200 font-mono">{receipt.receiptNo}</p>
                </div>
                {/* Details */}
                <div className="divide-y divide-gray-100">
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
                      <span className="text-xs text-gray-500">{row.label}</span>
                      <span className={`text-sm font-semibold ${row.label === 'Amount Paid' ? 'text-green-600 text-base' : 'text-gray-900'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                {/* Footer */}
                <div className="bg-green-50 px-5 py-3 text-center border-t border-green-100">
                  <p className="text-xs text-green-700 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />Payment Verified & Confirmed
                  </p>
                </div>
              </div>
            </DialogBody>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceipt(null)}>Close</Button>
            <Button onClick={() => window.print()} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
