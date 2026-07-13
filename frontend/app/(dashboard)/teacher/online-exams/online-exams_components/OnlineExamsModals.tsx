import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { OnlineExamForm, MCQQuestion } from '../online-exams_types';

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: OnlineExamForm;
  setForm: (v: OnlineExamForm | ((prev: OnlineExamForm) => OnlineExamForm)) => void;
  questions: Omit<MCQQuestion, 'id'>[];
  addQuestion: () => void;
  removeQuestion: (i: number) => void;
  updateQ: (i: number, field: keyof Omit<MCQQuestion, 'id' | 'options'>, value: string | number) => void;
  updateOption: (qi: number, oi: number, value: string) => void;
  handleCreate: () => void;
}

export function OnlineExamsModals({ 
  open, setOpen, form, setForm, questions, 
  addQuestion, removeQuestion, updateQ, updateOption, handleCreate 
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl bg-[var(--bg-card)] border-[var(--border)]">
        <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Create Online Exam</DialogTitle></DialogHeader>
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Exam Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Exam Title *</label>
              <Input placeholder="IoT Unit 1 Quiz" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Subject *</label>
              <Select value={form.subject} onValueChange={v => setForm(p => ({ ...p, subject: v }))}>
                <SelectItem value="IOT & Embedded Systems">IOT & Embedded Systems</SelectItem>
                <SelectItem value="Embedded C Programming">Embedded C Programming</SelectItem>
                <SelectItem value="Network Protocols">Network Protocols</SelectItem>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Duration (min)</label>
              <Input type="number" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Passing Marks</label>
              <Input type="number" placeholder="12" value={form.passingMarks} onChange={e => setForm(p => ({ ...p, passingMarks: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Scheduled At</label>
              <Input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]" />
            </div>
          </div>

          {/* Questions */}
          <div className="border-t border-[var(--border)] pt-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[var(--text-secondary)]">Questions ({questions.length})</p>
              <Button size="sm" variant="outline" onClick={addQuestion} className="flex items-center gap-1 text-xs border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-input)]">
                <Plus className="h-3 w-3" />Add Question
              </Button>
            </div>
            {questions.map((q, qi) => (
              <div key={qi} className="bg-[var(--bg-input)] rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">Q{qi + 1}</span>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={q.marks} onChange={e => updateQ(qi, 'marks', Number(e.target.value))} className="w-16 h-7 text-xs bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)]" placeholder="Marks" />
                    {questions.length > 1 && <button onClick={() => removeQuestion(qi)} className="text-[var(--danger)] hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>}
                  </div>
                </div>
                <Input placeholder="Question text..." value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} className="mb-2 text-sm bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)]" />
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-1.5">
                      <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi} onChange={() => updateQ(qi, 'correctIndex', oi)} className="accent-[var(--primary)]" />
                      <Input placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={e => updateOption(qi, oi, e.target.value)} className="h-7 text-xs bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)]" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1 opacity-70">● Select the radio button next to the correct answer</p>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-input)]">Cancel</Button>
          <Button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Create Exam</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
