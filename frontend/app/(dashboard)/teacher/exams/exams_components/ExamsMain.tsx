'use client';
import { useExams } from '../exams_hooks/useExams';
import { ResourceState } from '@/lib/useResource';
import { ExamsHeader } from './ExamsHeader';
import { ExamsStats } from './ExamsStats';
import { ExamsList } from './ExamsList';
import { ExamsModals } from './ExamsModals';

export function ExamsMain() {
  const {
    exams,
    loading,
    error,
    students,
    createOpen,
    setCreateOpen,
    expandedId,
    setExpandedId,
    resultsExamId,
    setResultsExamId,
    resultInputs,
    setResultInputs,
    form,
    setForm,
    handleCreate,
    handleSaveResults
  } = useExams();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <ExamsHeader onOpenCreate={() => setCreateOpen(true)} />
      <ExamsStats exams={exams} />
      <ExamsList 
        exams={exams}
        students={students}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        setResultsExamId={setResultsExamId}
        setResultInputs={setResultInputs}
      />
      <ExamsModals 
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        form={form}
        setForm={setForm}
        handleCreate={handleCreate}
        resultsExamId={resultsExamId}
        setResultsExamId={setResultsExamId}
        activeExam={exams.find(e => e.id === resultsExamId)}
        students={students}
        resultInputs={resultInputs}
        setResultInputs={setResultInputs}
        handleSaveResults={handleSaveResults}
      />
    </div>
  );
}
