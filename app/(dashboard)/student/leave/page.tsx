'use client';
import { useState } from 'react';
import { ResourceState, useResource } from '@/lib/useResource';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Plus, Calendar, CheckCircle, XCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';

const leaveTypeConfig = {
  sick:      { label: 'Sick Leave',      color: 'bg-red-100 text-red-700 border-red-200',         icon: '🤒' },
  casual:    { label: 'Casual Leave',    color: 'bg-blue-100 text-blue-700 border-blue-200',       icon: '🏖️' },
  emergency: { label: 'Emergency Leave', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🚨' },
  personal:  { label: 'Personal Leave',  color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '👤' },
};

const statusConfig = {
  pending:   { variant: 'warning' as const, icon: Clock,        label: 'Pending Review' },
  approved:  { variant: 'success' as const, icon: CheckCircle,  label: 'Approved' },
  rejected:  { variant: 'danger'  as const, icon: XCircle,      label: 'Rejected' },
  cancelled: { variant: 'outline' as const, icon: AlertCircle,  label: 'Cancelled' },
};
interface StudentLeaveRequest {
  id: string; leaveType: 'sick' | 'casual' | 'emergency' | 'personal';
  fromDate: string; toDate: string; reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string; totalDays: number; appliedOn: string;
  reviewedBy?: string; reviewRemarks?: string;
}

export default function StudentLeavePage() {
  const { data: rawLeaves, loading, error, create } = useResource<Omit<StudentLeaveRequest, 'totalDays' | 'appliedOn'>>('leaves');
  const leaves: StudentLeaveRequest[] = rawLeaves.map(leave => ({
    ...leave,
    leaveType: leave.leaveType || 'personal',
    totalDays: Math.max(1, Math.round((new Date(leave.toDate).getTime() - new Date(leave.fromDate).getTime()) / 86400000) + 1),
    appliedOn: new Date(leave.createdAt).toLocaleDateString(),
  }));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ leaveType: 'sick', fromDate: '', toDate: '', reason: '' });
  const [submitted, setSubmitted] = useState(false);

  const totalDays = (from: string, to: string) => {
    if (!from || !to) return 0;
    return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1);
  };

  const handleSubmit = async () => {
    if (!form.fromDate || !form.toDate || !form.reason.trim()) return;
    await create({
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      reason: form.reason,
      status: 'pending',
    });
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false); setSubmitted(false);
      setForm({ leaveType: 'sick', fromDate: '', toDate: '', reason: '' });
    }, 1800);
  };
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  const stats = [
    { label: 'Total Applied', value: leaves.length,                                                          color: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-200' },
    { label: 'Approved',      value: leaves.filter(l => l.status === 'approved').length,                     color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'Pending',       value: leaves.filter(l => l.status === 'pending').length,                      color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Days Taken',    value: leaves.filter(l => l.status === 'approved').reduce((a, l) => a + l.totalDays, 0), color: 'text-teal-600',  bg: 'bg-teal-50',  border: 'border-teal-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-teal-600" />My Leave
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Apply for leave and track your requests</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2 shadow-lg">
          <Plus className="h-4 w-4" />Apply Leave
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {leaves.map((leave, i) => {
          const ltCfg = leaveTypeConfig[leave.leaveType];
          const stCfg = statusConfig[leave.status];
          const StatusIcon = stCfg.icon;
          return (
            <div key={leave.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in-up card-hover"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-4 p-5">
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${ltCfg.color}`}>
                  {ltCfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-900">{ltCfg.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {leave.fromDate}{leave.fromDate !== leave.toDate ? ` → ${leave.toDate}` : ''} · {leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Badge variant={stCfg.variant} className="flex items-center gap-1 flex-shrink-0">
                      <StatusIcon className="h-3 w-3" />{stCfg.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{leave.reason}</p>
                  {leave.reviewRemarks && (
                    <div className={`mt-3 flex items-start gap-2 p-3 rounded-xl text-xs ${leave.status === 'approved' ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                      <ChevronRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span><strong>{leave.reviewedBy}:</strong> {leave.reviewRemarks}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-2">Applied on {leave.appliedOn}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-teal-600" />Apply for Leave
            </DialogTitle>
          </DialogHeader>
          {submitted ? (
            <DialogBody className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">Leave Applied!</p>
              <p className="text-sm text-gray-500 mt-1">Your request has been submitted for review.</p>
            </DialogBody>
          ) : (
            <>
              <DialogBody className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Leave Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(leaveTypeConfig) as [string, typeof leaveTypeConfig.sick][]).map(([key, cfg]) => (
                      <button key={key} onClick={() => setForm(p => ({ ...p, leaveType: key }))}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${form.leaveType === key ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                        <span className="text-lg">{cfg.icon}</span>{cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(['fromDate', 'toDate'] as const).map(field => (
                    <div key={field}>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                        {field === 'fromDate' ? 'From Date' : 'To Date'}
                      </label>
                      <input type="date" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
                    </div>
                  ))}
                </div>
                {form.fromDate && form.toDate && (
                  <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-xl border border-teal-100 animate-scale-in">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    <span className="text-sm text-teal-700 font-medium">
                      {totalDays(form.fromDate, form.toDate)} day{totalDays(form.fromDate, form.toDate) > 1 ? 's' : ''} of leave
                    </span>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Reason</label>
                  <Textarea placeholder="Describe the reason for your leave request..." value={form.reason}
                    onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={3} />
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={!form.fromDate || !form.toDate || !form.reason.trim()}>
                  Submit Request
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
