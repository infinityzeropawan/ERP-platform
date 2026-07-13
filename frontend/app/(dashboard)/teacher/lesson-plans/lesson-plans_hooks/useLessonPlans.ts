import { useState } from 'react';
import { LessonPlan, LessonPlanForm } from '../lesson-plans_types';

export function useLessonPlans() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [open, setOpen] = useState(false);
  const [viewPlan, setViewPlan] = useState<LessonPlan | null>(null);
  const [form, setForm] = useState<LessonPlanForm>({ 
    subject: '', subjectCode: '', topic: '', objectives: '', content: '', teachingAids: '', plannedDate: '', durationMins: '', status: 'draft' 
  });

  const handleCreate = () => {
    if (!form.subject || !form.topic) return;
    setPlans(p => [{
      id: `lp-${Date.now()}`, ...form, durationMins: Number(form.durationMins) || 60,
    }, ...p]);
    setForm({ subject: '', subjectCode: '', topic: '', objectives: '', content: '', teachingAids: '', plannedDate: '', durationMins: '', status: 'draft' });
    setOpen(false);
  };

  return {
    plans,
    open, setOpen,
    viewPlan, setViewPlan,
    form, setForm,
    handleCreate
  };
}
