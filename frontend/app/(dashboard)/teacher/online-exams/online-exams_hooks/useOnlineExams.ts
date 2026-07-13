import { useState } from 'react';
import { OnlineExam, OnlineExamForm, MCQQuestion } from '../online-exams_types';

export function useOnlineExams() {
  const [exams, setExams] = useState<OnlineExam[]>([]);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<OnlineExamForm>({ 
    title: '', subject: '', subjectCode: '', durationMins: '30', totalMarks: '', passingMarks: '', scheduledAt: '' 
  });
  const [questions, setQuestions] = useState<Omit<MCQQuestion, 'id'>[]>([
    { question: '', options: ['', '', '', ''], correctIndex: 0, marks: 2 }
  ]);

  const addQuestion = () => setQuestions(p => [...p, { question: '', options: ['', '', '', ''], correctIndex: 0, marks: 2 }]);
  const removeQuestion = (i: number) => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updateQ = (i: number, field: keyof Omit<MCQQuestion, 'id' | 'options'>, value: string | number) => 
    setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  const updateOption = (qi: number, oi: number, value: string) => 
    setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, oidx) => oidx === oi ? value : o) } : q));

  const handleCreate = () => {
    if (!form.title || !form.subject) return;
    const newExam: OnlineExam = {
      id: `oe-${Date.now()}`, 
      title: form.title, 
      subject: form.subject, 
      subjectCode: form.subjectCode,
      durationMins: Number(form.durationMins), 
      totalMarks: Number(form.totalMarks) || questions.reduce((a, q) => a + q.marks, 0),
      passingMarks: Number(form.passingMarks), 
      scheduledAt: form.scheduledAt, 
      status: 'upcoming',
      questions: questions.filter(q => q.question).map((q, i) => ({ ...q, id: `q${i + 1}` })),
    };
    setExams(p => [newExam, ...p]);
    setForm({ title: '', subject: '', subjectCode: '', durationMins: '30', totalMarks: '', passingMarks: '', scheduledAt: '' });
    setQuestions([{ question: '', options: ['', '', '', ''], correctIndex: 0, marks: 2 }]);
    setOpen(false);
  };

  return {
    exams, setExams,
    open, setOpen,
    expandedId, setExpandedId,
    form, setForm,
    questions, setQuestions,
    addQuestion, removeQuestion, updateQ, updateOption,
    handleCreate
  };
}
