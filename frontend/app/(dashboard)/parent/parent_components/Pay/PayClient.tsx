'use client';

import React from 'react';
import { CreditCard, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { usePay } from '../../parent_hooks/usePay';
import '../../parent.css';

export default function PayClient() {
  const {
    history,
    loading,
    payingId,
    toast,
    pendingFees,
    handlePay
  } = usePay();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--parent-primary)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl font-medium animate-fade-in ${toast.type === 'success' ? 'text-white' : 'text-white'}`}
             style={{ backgroundColor: toast.type === 'success' ? 'var(--parent-success)' : 'var(--parent-danger)' }}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center gap-3 animate-fade-in">
        <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--parent-primary-subtle)' }}>
          <CreditCard className="h-6 w-6" style={{ color: 'var(--parent-primary)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--parent-text-primary)' }}>Fee Payments</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--parent-text-secondary)' }}>View and pay pending fees securely online</p>
        </div>
      </div>

      {/* Pending Fees */}
      <div className="animate-fade-in-up">
        <h2 className="text-base font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--parent-text-primary)' }}>
          <AlertCircle className="h-4 w-4" style={{ color: 'var(--parent-warning)' }} /> 
          Pending Fees ({pendingFees.length})
        </h2>
        
        {pendingFees.length === 0 ? (
          <div className="border rounded-2xl p-8 text-center shadow-sm" style={{ backgroundColor: 'var(--parent-success-bg)', borderColor: 'var(--parent-success)' }}>
            <CheckCircle className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--parent-success)' }} />
            <p className="font-bold text-lg" style={{ color: 'var(--parent-success)' }}>All fees are paid!</p>
            <p className="text-sm mt-1 opacity-90" style={{ color: 'var(--parent-success)' }}>You're all clear.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingFees.map((fee, index) => (
              <div key={fee.id} className="border rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4 transition-transform hover:scale-[1.01]"
                   style={{ 
                     backgroundColor: 'var(--parent-bg-card)', 
                     borderColor: 'var(--parent-danger)',
                     animationDelay: `${index * 80}ms` 
                   }}>
                <div>
                  <p className="font-bold text-lg" style={{ color: 'var(--parent-text-primary)' }}>{fee.description || 'Fee'}</p>
                  <p className="text-sm font-medium mt-1 flex items-center gap-1.5" style={{ color: 'var(--parent-danger)' }}>
                    <AlertCircle className="h-3.5 w-3.5" />Due: {new Date(fee.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-5">
                  <p className="text-2xl font-black" style={{ color: 'var(--parent-text-primary)' }}>₹{fee.amount.toLocaleString()}</p>
                  <button onClick={() => handlePay(fee)} disabled={payingId === fee.id}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-md min-w-[140px]"
                    style={{ backgroundColor: 'var(--parent-primary)', color: 'white' }}>
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
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-base font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--parent-text-primary)' }}>
            <CheckCircle className="h-4 w-4" style={{ color: 'var(--parent-success)' }} />
            Payment History
          </h2>
          <div className="border rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--parent-bg-card)', borderColor: 'var(--parent-border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b" style={{ backgroundColor: 'var(--parent-bg-hover)', borderColor: 'var(--parent-border)' }}>
                  <tr>
                    <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--parent-text-secondary)' }}>Date</th>
                    <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--parent-text-secondary)' }}>Gateway</th>
                    <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--parent-text-secondary)' }}>Amount</th>
                    <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--parent-text-secondary)' }}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--parent-border)' }}>
                  {history.map(p => (
                    <tr key={p.id} className="transition-colors hover:bg-gray-50/10">
                      <td className="px-5 py-4 font-medium" style={{ color: 'var(--parent-text-secondary)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4"><span className="capitalize font-medium" style={{ color: 'var(--parent-text-primary)' }}>{p.gateway}</span></td>
                      <td className="px-5 py-4 font-bold" style={{ color: 'var(--parent-text-primary)' }}>₹{p.amount.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border"
                              style={{ 
                                backgroundColor: p.status === 'paid' ? 'var(--parent-success-bg)' : p.status === 'failed' ? 'var(--parent-danger-bg)' : 'var(--parent-warning-bg)',
                                color: p.status === 'paid' ? 'var(--parent-success)' : p.status === 'failed' ? 'var(--parent-danger)' : 'var(--parent-warning)',
                                borderColor: p.status === 'paid' ? 'var(--parent-success)' : p.status === 'failed' ? 'var(--parent-danger)' : 'var(--parent-warning)'
                              }}>
                          {p.status === 'paid' ? <CheckCircle className="h-3 w-3" /> : p.status === 'failed' ? <XCircle className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
