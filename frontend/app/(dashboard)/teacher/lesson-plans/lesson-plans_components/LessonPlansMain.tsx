'use client';
import { useLessonPlans } from '../lesson-plans_hooks/useLessonPlans';
import { LessonPlansHeader } from './LessonPlansHeader';
import { LessonPlansStats } from './LessonPlansStats';
import { LessonPlansTable } from './LessonPlansTable';
import { LessonPlansModals } from './LessonPlansModals';

export function LessonPlansMain() {
  const {
    plans,
    open, setOpen,
    viewPlan, setViewPlan,
    form, setForm,
    handleCreate
  } = useLessonPlans();

  return (
    <div className="space-y-6">
      <LessonPlansHeader onOpenCreate={() => setOpen(true)} />
      <LessonPlansStats plans={plans} />
      <LessonPlansTable plans={plans} onView={setViewPlan} />
      <LessonPlansModals 
        open={open} setOpen={setOpen}
        form={form} setForm={setForm}
        handleCreate={handleCreate}
        viewPlan={viewPlan} setViewPlan={setViewPlan}
      />
    </div>
  );
}
