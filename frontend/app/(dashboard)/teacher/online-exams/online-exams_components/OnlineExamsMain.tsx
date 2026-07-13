'use client';
import { useOnlineExams } from '../online-exams_hooks/useOnlineExams';
import { OnlineExamsHeader } from './OnlineExamsHeader';
import { OnlineExamsStats } from './OnlineExamsStats';
import { OnlineExamsList } from './OnlineExamsList';
import { OnlineExamsModals } from './OnlineExamsModals';

export function OnlineExamsMain() {
  const {
    exams,
    open, setOpen,
    expandedId, setExpandedId,
    form, setForm,
    questions,
    addQuestion, removeQuestion, updateQ, updateOption,
    handleCreate
  } = useOnlineExams();

  return (
    <div className="space-y-6">
      <OnlineExamsHeader onOpenCreate={() => setOpen(true)} />
      <OnlineExamsStats exams={exams} />
      <OnlineExamsList exams={exams} expandedId={expandedId} setExpandedId={setExpandedId} />
      <OnlineExamsModals 
        open={open} setOpen={setOpen} 
        form={form} setForm={setForm} 
        questions={questions} 
        addQuestion={addQuestion} 
        removeQuestion={removeQuestion} 
        updateQ={updateQ} 
        updateOption={updateOption} 
        handleCreate={handleCreate} 
      />
    </div>
  );
}
