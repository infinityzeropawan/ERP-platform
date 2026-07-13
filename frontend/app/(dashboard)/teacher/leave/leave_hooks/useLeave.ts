import { useState } from 'react';
import { LeaveRequest, LeaveForm } from '../leave_types';

const initialLeaves: LeaveRequest[] = [
  { id: 'lv-001', type: 'Sick Leave', from: '2026-07-10', to: '2026-07-11', reason: 'Fever and cold', status: 'approved' },
  { id: 'lv-002', type: 'Casual Leave', from: '2026-07-20', to: '2026-07-20', reason: 'Personal work', status: 'pending' },
];

export function useLeave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<LeaveForm>({ type: '', from: '', to: '', reason: '' });

  const submit = () => {
    if (!form.type || !form.from || !form.to) return;
    setLeaves(p => [...p, { id: `lv-${Date.now()}`, ...form, status: 'pending' }]);
    setForm({ type: '', from: '', to: '', reason: '' });
    setOpen(false);
  };

  return {
    leaves,
    open, setOpen,
    form, setForm,
    submit
  };
}
