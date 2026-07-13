import { useState, useEffect } from 'react';
import { useResource } from '@/lib/useResource';
import { Exam, RawExam, Student, ExamForm } from '../exams_types';

export function useExams() {
  const { data: rawExams, loading, error, create } = useResource<RawExam>('exams');
  
  const exams: Exam[] = rawExams.map(e => ({
    ...e,
    date: new Date(e.startsAt).toLocaleDateString(),
    time: new Date(e.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: `${e.durationMins} min`,
    examType: 'Exam',
  }));

  const [students, setStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    fetch('/api/v1/teacher/students').then(r => r.ok ? r.json() : []).then(setStudents);
  }, []);

  const [createOpen, setCreateOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resultsExamId, setResultsExamId] = useState<string | null>(null);
  const [resultInputs, setResultInputs] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState<ExamForm>({ 
    subject: '', 
    examType: '', 
    date: '', 
    time: '', 
    durationMins: '60', 
    maxMarks: '100', 
    passingMarks: '40', 
    room: '', 
    syllabus: '' 
  });

  const handleCreate = async () => {
    if (!form.subject || !form.date || !form.examType) return;
    await create({
      subject: form.subject, className: 'IOT-2026', section: 'Evening',
      startsAt: `${form.date}T${form.time || '10:00'}:00`,
      durationMins: Number(form.durationMins), maxMarks: Number(form.maxMarks),
      passingMarks: Number(form.passingMarks), room: form.room, syllabus: form.syllabus,
      status: 'scheduled',
    });
    setForm({ subject: '', examType: '', date: '', time: '', durationMins: '60', maxMarks: '100', passingMarks: '40', room: '', syllabus: '' });
    setCreateOpen(false);
  };

  const handleSaveResults = async (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;
    await Promise.all(students.map(s => {
      const marks = Number(resultInputs[s.id] ?? 0);
      return fetch('/api/v1/teacher/gradebook/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: exam.subject, entries: [{ id: s.id, studentName: s.name, [exam.examType]: marks }] }),
      });
    }));
    setResultsExamId(null);
    setResultInputs({});
  };

  return {
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
  };
}
