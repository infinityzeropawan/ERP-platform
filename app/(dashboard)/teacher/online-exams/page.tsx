'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';

type MCQQuestion = { id: string; question: string; options: string[]; correctIndex: number; marks: number; }; type OnlineExam = { id: string; title: string; subject: string; subjectCode: string; durationMins: number; totalMarks: number; passingMarks: number; scheduledAt: string; status: 'upcoming' | 'live' | 'completed'; questions: MCQQuestion[]; };
import { ClipboardList, Plus, Clock, Award, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

const statusConfig = {
  upcoming: { variant: 'warning' as const },
  live: { variant: 'danger' as const },
  completed: { variant: 'success' as const },
};

export default function TeacherOnlineExamsPage() {
  const [exams, setExams] = useState<OnlineExam[]>([]);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', subject: '', subjectCode: '', durationMins: '30', totalMarks: '', passingMarks: '', scheduledAt: '' });
  const [questions, setQuestions] = useState<Omit<MCQQuestion, 'id'>[]>([{ question: '', options: ['', '', '', ''], correctIndex: 0, marks: 2 }]);

  const addQuestion = () => setQuestions(p => [...p, { question: '', options: ['', '', '', ''], correctIndex: 0, marks: 2 }]);
  const removeQuestion = (i: number) => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updateQ = (i: number, field: string, value: string | number) => setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  const updateOption = (qi: number, oi: number, value: string) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, oidx) => oidx === oi ? value : o) } : q));

  const handleCreate = () => {
    if (!form.title || !form.subject) return;
    const newExam: OnlineExam = {
      id: `oe-${Date.now()}`, title: form.title, subject: form.subject, subjectCode: form.subjectCode,
      durationMins: Number(form.durationMins), totalMarks: Number(form.totalMarks) || questions.reduce((a, q) => a + q.marks, 0),
      passingMarks: Number(form.passingMarks), scheduledAt: form.scheduledAt, status: 'upcoming',
      questions: questions.filter(q => q.question).map((q, i) => ({ ...q, id: `q${i + 1}` })),
    };
    setExams(p => [newExam, ...p]);
    setForm({ title: '', subject: '', subjectCode: '', durationMins: '30', totalMarks: '', passingMarks: '', scheduledAt: '' });
    setQuestions([{ question: '', options: ['', '', '', ''], correctIndex: 0, marks: 2 }]);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ClipboardList className="h-6 w-6 text-teal-600" />Online Exams (MCQ)</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create and manage MCQ-based online examinations</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />Create Exam</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Exams', value: exams.length, color: 'text-teal-600' },
          { label: 'Upcoming', value: exams.filter(e => e.status === 'upcoming').length, color: 'text-amber-600' },
          { label: 'Completed', value: exams.filter(e => e.status === 'completed').length, color: 'text-green-600' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      <div className="space-y-3">
        {exams.map(exam => (
          <Card key={exam.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{exam.title}</p>
                    <Badge variant={statusConfig[exam.status].variant}>{exam.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{exam.subject} ({exam.subjectCode})</p>
                  <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exam.durationMins} min</span>
                    <span className="flex items-center gap-1"><Award className="h-3 w-3" />{exam.totalMarks} marks | Pass: {exam.passingMarks}</span>
                    <span>📅 {new Date(exam.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    <span>❓ {exam.questions.length} questions</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)} className="flex items-center gap-1">
                  {expandedId === exam.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}Questions
                </Button>
              </div>

              {expandedId === exam.id && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  {exam.questions.map((q, i) => (
                    <div key={q.id} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">Q{i + 1}. {q.question} <span className="text-xs text-teal-600 font-normal">({q.marks} marks)</span></p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`text-xs px-3 py-1.5 rounded-lg border ${oi === q.correctIndex ? 'bg-green-50 border-green-300 text-green-700 font-semibold' : 'bg-white border-gray-200 text-gray-600'}`}>
                            {String.fromCharCode(65 + oi)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader><DialogTitle>Create Online Exam</DialogTitle></DialogHeader>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {/* Exam Details */}
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Exam Title *</label><Input placeholder="IoT Unit 1 Quiz" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject *</label>
                <Select value={form.subject} onValueChange={v => setForm(p => ({ ...p, subject: v }))} placeholder="Select Subject">
                  <SelectItem value="IOT & Embedded Systems">IOT & Embedded Systems</SelectItem>
                  <SelectItem value="Embedded C Programming">Embedded C Programming</SelectItem>
                  <SelectItem value="Network Protocols">Network Protocols</SelectItem>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Duration (min)</label><Input type="number" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Passing Marks</label><Input type="number" placeholder="12" value={form.passingMarks} onChange={e => setForm(p => ({ ...p, passingMarks: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Scheduled At</label><Input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))} /></div>
            </div>

            {/* Questions */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Questions ({questions.length})</p>
                <Button size="sm" variant="outline" onClick={addQuestion} className="flex items-center gap-1 text-xs"><Plus className="h-3 w-3" />Add Question</Button>
              </div>
              {questions.map((q, qi) => (
                <div key={qi} className="bg-gray-50 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500">Q{qi + 1}</span>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={q.marks} onChange={e => updateQ(qi, 'marks', Number(e.target.value))} className="w-16 h-7 text-xs" placeholder="Marks" />
                      {questions.length > 1 && <button onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>}
                    </div>
                  </div>
                  <Input placeholder="Question text..." value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} className="mb-2 text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-1.5">
                        <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi} onChange={() => updateQ(qi, 'correctIndex', oi)} className="accent-teal-600" />
                        <Input placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={e => updateOption(qi, oi, e.target.value)} className="h-7 text-xs" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">● Select the radio button next to the correct answer</p>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
