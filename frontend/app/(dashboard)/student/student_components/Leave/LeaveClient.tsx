'use client';

import { useState } from 'react';
import { ResourceState } from '@/lib/useResource';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Plus, Calendar, CheckCircle, XCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { useLeave } from '../../student_hooks/useLeave';
import '../../student.css';

const leaveTypeConfig = {
  sick:      { label: 'Sick Leave',      color: 'var(--student-danger)',  bg: 'var(--student-danger-bg)',  border: 'var(--student-danger)',  icon: '🤒' },
  casual:    { label: 'Casual Leave',    color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-primary)', icon: '🏖️' },
  emergency: { label: 'Emergency Leave', color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)', icon: '🚨' },
  personal:  { label: 'Personal Leave',  color: 'var(--student-info)',    bg: 'var(--student-info-bg)',    border: 'var(--student-info)',    icon: '👤' },
};

const statusConfig = {
  pending:   { variant: 'warning' as const, icon: Clock,        label: 'Pending Review', color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)' },
  approved:  { variant: 'success' as const, icon: CheckCircle,  label: 'Approved',       color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)' },
  rejected:  { variant: 'danger'  as const, icon: XCircle,      label: 'Rejected',       color: 'var(--student-danger)',  bg: 'var(--student-danger-bg)',  border: 'var(--student-danger)' },
  cancelled: { variant: 'outline' as const, icon: AlertCircle,  label: 'Cancelled',      color: 'var(--student-text-disabled)', bg: 'var(--student-bg-input)', border: 'var(--student-border)' },
};

export default function LeaveClient() {
  const { leaves, loading, error, totalDaysCalc, applyLeave } = useLeave();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ leaveType: 'sick', fromDate: '', toDate: '', reason: '' });
  const [submitted, setSubmitted] = useState(false);

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  const handleSubmit = async () => {
    const success = await applyLeave(form);
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false); setSubmitted(false);
        setForm({ leaveType: 'sick', fromDate: '', toDate: '', reason: '' });
      }, 1800);
    }
  };

  const stats = [
    { label: 'Total Applied', value: leaves.length, color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-primary)' },
    { label: 'Approved',      value: leaves.filter(l => l.status === 'approved').length, color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)' },
    { label: 'Pending',       value: leaves.filter(l => l.status === 'pending').length, color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)' },
    { label: 'Days Taken',    value: leaves.filter(l => l.status === 'approved').reduce((a, l) => a + l.totalDays, 0), color: 'var(--student-info)', bg: 'var(--student-info-bg)', border: 'var(--student-info)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <Briefcase className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />My Leave
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Apply for leave and track your requests</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2 shadow-lg" style={{ backgroundColor: 'var(--student-primary)', color: 'white' }}>
          <Plus className="h-4 w-4" />Apply Leave
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="border rounded-2xl p-4 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, backgroundColor: s.bg, borderColor: s.border }}>
            <p className="text-xs font-medium" style={{ color: 'var(--student-text-secondary)' }}>{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
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
              className="rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden animate-fade-in-up card-hover"
              style={{ animationDelay: `${i * 60}ms`, backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
              <div className="flex items-start gap-4 p-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border" style={{ backgroundColor: ltCfg.bg, color: ltCfg.color, borderColor: ltCfg.border }}>
                  {ltCfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--student-text-primary)' }}>{ltCfg.label}</p>
                      <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--student-text-disabled)' }}>
                        <Calendar className="h-3 w-3" />
                        {leave.fromDate}{leave.fromDate !== leave.toDate ? ` → ${leave.toDate}` : ''} · {leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Badge className="flex items-center gap-1 flex-shrink-0" style={{ backgroundColor: stCfg.bg, color: stCfg.color, borderColor: stCfg.border }}>
                      <StatusIcon className="h-3 w-3" />{stCfg.label}
                    </Badge>
                  </div>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--student-text-secondary)' }}>{leave.reason}</p>
                  {leave.reviewRemarks && (
                    <div className="mt-3 flex items-start gap-2 p-3 rounded-xl text-xs border" style={{ backgroundColor: leave.status === 'approved' ? 'var(--student-success-bg)' : 'var(--student-danger-bg)', borderColor: leave.status === 'approved' ? 'var(--student-success)' : 'var(--student-danger)', color: leave.status === 'approved' ? 'var(--student-success)' : 'var(--student-danger)' }}>
                      <ChevronRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span><strong>{leave.reviewedBy}:</strong> {leave.reviewRemarks}</span>
                    </div>
                  )}
                  <p className="text-[10px] mt-2" style={{ color: 'var(--student-text-disabled)' }}>Applied on {leave.appliedOn}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
              <Briefcase className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />Apply for Leave
            </DialogTitle>
          </DialogHeader>
          {submitted ? (
            <DialogBody className="text-center py-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in" style={{ backgroundColor: 'var(--student-success-bg)' }}>
                <CheckCircle className="h-8 w-8" style={{ color: 'var(--student-success)' }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: 'var(--student-text-primary)' }}>Leave Applied!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--student-text-secondary)' }}>Your request has been submitted for review.</p>
            </DialogBody>
          ) : (
            <>
              <DialogBody className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: 'var(--student-text-secondary)' }}>Leave Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(leaveTypeConfig) as [string, typeof leaveTypeConfig.sick][]).map(([key, cfg]) => (
                      <button key={key} onClick={() => setForm(p => ({ ...p, leaveType: key }))}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all`}
                        style={{
                          borderColor: form.leaveType === key ? 'var(--student-primary)' : 'var(--student-border)',
                          backgroundColor: form.leaveType === key ? 'var(--student-primary-subtle)' : 'var(--student-bg-input)',
                          color: form.leaveType === key ? 'var(--student-primary)' : 'var(--student-text-secondary)'
                        }}>
                        <span className="text-lg">{cfg.icon}</span>{cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(['fromDate', 'toDate'] as const).map(field => (
                    <div key={field}>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--student-text-secondary)' }}>
                        {field === 'fromDate' ? 'From Date' : 'To Date'}
                      </label>
                      <input type="date" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                        className="w-full h-10 px-3 rounded-xl border text-sm focus:outline-none transition-all"
                        style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }} />
                    </div>
                  ))}
                </div>
                {form.fromDate && form.toDate && (
                  <div className="flex items-center gap-2 p-3 rounded-xl border animate-scale-in" style={{ backgroundColor: 'var(--student-info-bg)', borderColor: 'var(--student-info)' }}>
                    <Calendar className="h-4 w-4" style={{ color: 'var(--student-info)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--student-info)' }}>
                      {totalDaysCalc(form.fromDate, form.toDate)} day{totalDaysCalc(form.fromDate, form.toDate) > 1 ? 's' : ''} of leave
                    </span>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--student-text-secondary)' }}>Reason</label>
                  <Textarea placeholder="Describe the reason for your leave request..." value={form.reason}
                    onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={3}
                    style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }} />
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={!form.fromDate || !form.toDate || !form.reason.trim()} style={{ backgroundColor: 'var(--student-primary)', color: 'white' }}>
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
