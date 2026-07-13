'use client';
import { useLeave } from '../leave_hooks/useLeave';
import { LeaveHeader } from './LeaveHeader';
import { LeaveStats } from './LeaveStats';
import { LeaveList } from './LeaveList';
import { LeaveModals } from './LeaveModals';

export function LeaveMain() {
  const {
    leaves,
    open, setOpen,
    form, setForm,
    submit
  } = useLeave();

  return (
    <div className="space-y-6">
      <LeaveHeader onOpenApply={() => setOpen(true)} />
      <LeaveStats leaves={leaves} />
      <LeaveList leaves={leaves} />
      <LeaveModals 
        open={open} setOpen={setOpen}
        form={form} setForm={setForm}
        submit={submit}
      />
    </div>
  );
}
