import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ExamForm, Exam, Student } from '../exams_types';

interface Props {
  createOpen: boolean;
  setCreateOpen: (v: boolean) => void;
  form: ExamForm;
  setForm: (val: ExamForm | ((prev: ExamForm) => ExamForm)) => void;
  handleCreate: () => void;
  
  resultsExamId: string | null;
  setResultsExamId: (v: string | null) => void;
  activeExam?: Exam;
  students: Student[];
  resultInputs: Record<string, string>;
  setResultInputs: (val: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  handleSaveResults: (examId: string) => void;
}

export function ExamsModals({
  createOpen, setCreateOpen, form, setForm, handleCreate,
  resultsExamId, setResultsExamId, activeExam, students,
  resultInputs, setResultInputs, handleSaveResults
}: Props) {
  return (
    <>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="w-full max-w-lg bg-[var(--bg-card)] border-[var(--border)]">
          <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Schedule New Exam</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Subject *</label>
                <Input placeholder="IOT & Embedded Systems" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Exam Type *</label>
                <Select value={form.examType} onValueChange={v => setForm(p => ({ ...p, examType: v }))}>
                  <SelectItem value="Unit Test 1">Unit Test 1</SelectItem>
                  <SelectItem value="Unit Test 2">Unit Test 2</SelectItem>
                  <SelectItem value="Mid Term">Mid Term</SelectItem>
                  <SelectItem value="Final Exam">Final Exam</SelectItem>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Date *</label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]" /></div>
              <div><label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Time</label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]" /></div>
              <div><label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Duration (min)</label><Input type="number" placeholder="60" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Max Marks</label><Input type="number" placeholder="100" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" /></div>
              <div><label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Pass Marks</label><Input type="number" placeholder="40" value={form.passingMarks} onChange={e => setForm(p => ({ ...p, passingMarks: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" /></div>
              <div><label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Room</label><Input placeholder="Hall-A" value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" /></div>
            </div>
            <div><label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Syllabus</label><Textarea placeholder="Topics covered..." rows={2} value={form.syllabus} onChange={e => setForm(p => ({ ...p, syllabus: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
            <Button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Schedule Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!resultsExamId} onOpenChange={() => setResultsExamId(null)}>
        <DialogContent className="w-full max-w-lg bg-[var(--bg-card)] border-[var(--border)]">
          <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Enter Results — {activeExam?.subject}</DialogTitle></DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {students.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 bg-[var(--primary-subtle)] rounded-lg">
                <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">{s.name}</span>
                <span className="text-xs text-[var(--text-secondary)]">/{activeExam?.maxMarks}</span>
                <Input type="number" min={0} max={activeExam?.maxMarks} placeholder="Marks"
                  value={resultInputs[s.id] ?? ''} onChange={e => setResultInputs(p => ({ ...p, [s.id]: e.target.value }))}
                  className="w-20 h-8 text-sm bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResultsExamId(null)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
            <Button onClick={() => activeExam && handleSaveResults(activeExam.id)} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Save Results</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
