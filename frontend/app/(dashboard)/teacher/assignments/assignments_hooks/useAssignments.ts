import { useState } from 'react';
import { useResource } from '@/lib/useResource';
import { Assignment, RawAssignment, AssignmentForm } from '../assignments_types';

export function useAssignments() {
  const { data: rawAssignments, loading, error, create } = useResource<RawAssignment>('assignments');
  
  const assignments: Assignment[] = rawAssignments.map(item => ({
    ...item, 
    class: item.className, 
    dueDate: new Date(item.dueAt).toLocaleDateString(),
  }));

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AssignmentForm>({ 
    title: '', 
    subject: '', 
    dueDate: '', 
    maxMarks: '', 
    description: '', 
    status: 'active' 
  });

  const handleCreate = async () => {
    if (!form.title || !form.subject || !form.dueDate) return;
    await create({
      title: form.title,
      className: 'IOT-2026',
      subject: form.subject,
      dueAt: form.dueDate,
      maxMarks: Number(form.maxMarks) || 100,
      status: form.status,
      description: form.description,
    });
    setForm({ title: '', subject: '', dueDate: '', maxMarks: '', description: '', status: 'active' });
    setOpen(false);
  };

  return {
    assignments,
    loading,
    error,
    open,
    setOpen,
    form,
    setForm,
    handleCreate
  };
}
