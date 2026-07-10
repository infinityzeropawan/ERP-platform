'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ResourceState, useResource } from '@/lib/useResource';
import { Award, Plus, Calendar, Clock, MapPin, ClipboardCheck, ChevronDown, ChevronUp } from 'lucide-react';

function calcGrade(marks: number, max: number) {
  const pct = (marks / max) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  return 'F';
}

export default function TeacherExamsPage() {
  const { data: rawExams, loading, error, create } = useResource<{
    id: string; subject: string; startsAt: string; durationMins: number;
    maxMarks: number; passingMarks?: number; room?: string; syllabus?: string;
    status: 'scheduled' | 'completed';
  }>('exams');
  const exams = rawExams.map(e => ({
    ...e,
    date: new Date(e.startsAt).toLocaleDateString(),
    time: new Date(e.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: `${e.durationMins} min`,
    examType: 'Exam',
  }));

  const [students, setStudents] = useState<Array<{ id: string; name: string; rollNo?: string }>>([]);
  useEffect(() => {
    fetch('/api/v1/teacher/students').then(r => r.ok ? r.json() : []).then(setStudents);
  }, []);

  const [createOpen, setCreateOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resultsExamId, setResultsExamId] = useState<string | null>(null);
  const [resultInputs, setResultInputs] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ subject: '', examType: '', date: '', time: '', durationMins: '60', maxMarks: '100', passingMarks: '40', room: '', syllabus: '' });

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

  const activeExam = exams.find(e => e.id === resultsExamId);
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Award className="h-6 w-6 text-teal-600" />Exams & Results</h1>
          <p className="text-gray-500 text-sm mt-0.5">Schedule exams and enter student marks</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />Schedule Exam</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Exams', value: exams.length, color: 'text-teal-600' },
          { label: 'Scheduled', value: exams.filter(e => e.status === 'scheduled').length, color: 'text-amber-600' },
          { label: 'Completed', value: exams.filter(e => e.status === 'completed').length, color: 'text-green-600' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      <div className="space-y-3">
        {exams.map(exam => (
          <Card key={exam.id} className={exam.status === 'scheduled' ? 'border-amber-200' : 'border-green-200'}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{exam.subject}</p>
                    <Badge variant={exam.status === 'scheduled' ? 'warning' : 'success'}>{exam.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-purple-400" />{exam.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-400" />{exam.time} · {exam.duration}</span>
                    {exam.room && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-teal-400" />{exam.room}</span>}
                    <span className="text-xs text-gray-400">Max: {exam.maxMarks} | Pass: {exam.passingMarks}</span>
                  </div>
                  {exam.syllabus && <p className="text-xs text-gray-400 mt-1">📚 {exam.syllabus}</p>}
                </div>
                <div className="flex gap-2">
                  {exam.status === 'scheduled' && (
                    <Button size="sm" onClick={() => { setResultsExamId(exam.id); setResultInputs({}); }} className="flex items-center gap-1">
                      <ClipboardCheck className="h-3.5 w-3.5" />Enter Results
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)} className="flex items-center gap-1">
                    {expandedId === exam.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}Students
                  </Button>
                </div>
              </div>
              {expandedId === exam.id && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-xs text-gray-500">{students.length} students enrolled in this class.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader><DialogTitle>Schedule New Exam</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject *</label><Input placeholder="IOT & Embedded Systems" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Exam Type *</label>
                <Select value={form.examType} onValueChange={v => setForm(p => ({ ...p, examType: v }))} placeholder="Select type">
                  <SelectItem value="Unit Test 1">Unit Test 1</SelectItem>
                  <SelectItem value="Unit Test 2">Unit Test 2</SelectItem>
                  <SelectItem value="Mid Term">Mid Term</SelectItem>
                  <SelectItem value="Final Exam">Final Exam</SelectItem>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Date *</label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Time</label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Duration (min)</label><Input type="number" placeholder="60" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Max Marks</label><Input type="number" placeholder="100" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Pass Marks</label><Input type="number" placeholder="40" value={form.passingMarks} onChange={e => setForm(p => ({ ...p, passingMarks: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Room</label><Input placeholder="Hall-A" value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} /></div>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Syllabus</label><Textarea placeholder="Topics covered..." rows={2} value={form.syllabus} onChange={e => setForm(p => ({ ...p, syllabus: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Schedule Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!resultsExamId} onOpenChange={() => setResultsExamId(null)}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader><DialogTitle>Enter Results — {activeExam?.subject}</DialogTitle></DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {students.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span className="flex-1 text-sm font-medium text-gray-900">{s.name}</span>
                <span className="text-xs text-gray-400">/{activeExam?.maxMarks}</span>
                <Input type="number" min={0} max={activeExam?.maxMarks} placeholder="Marks"
                  value={resultInputs[s.id] ?? ''} onChange={e => setResultInputs(p => ({ ...p, [s.id]: e.target.value }))}
                  className="w-20 h-8 text-sm" />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResultsExamId(null)}>Cancel</Button>
            <Button onClick={() => activeExam && handleSaveResults(activeExam.id)}>Save Results</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
