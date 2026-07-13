import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { LessonPlan, LessonPlanForm } from '../lesson-plans_types';

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: LessonPlanForm;
  setForm: (v: LessonPlanForm | ((prev: LessonPlanForm) => LessonPlanForm)) => void;
  handleCreate: () => void;
  viewPlan: LessonPlan | null;
  setViewPlan: (v: LessonPlan | null) => void;
}

export function LessonPlansModals({ open, setOpen, form, setForm, handleCreate, viewPlan, setViewPlan }: Props) {
  const statusConfig: Record<string, string> = {
    draft: 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]',
    approved: 'bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]',
    completed: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]',
  };

  return (
    <>
      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg bg-[var(--bg-card)] border-[var(--border)]">
          <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Create Lesson Plan</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Subject *</label>
                <Input placeholder="IOT & Embedded Systems" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Subject Code</label>
                <Input placeholder="IOT101" value={form.subjectCode} onChange={e => setForm(p => ({ ...p, subjectCode: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Topic *</label>
              <Input placeholder="MQTT Protocol" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Learning Objectives</label>
              <Textarea placeholder="Students will be able to..." rows={2} value={form.objectives} onChange={e => setForm(p => ({ ...p, objectives: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Content / Activities</label>
              <Textarea placeholder="Theory + Practical details..." rows={3} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Teaching Aids</label>
              <Input placeholder="Whiteboard, Arduino kit, Projector" value={form.teachingAids} onChange={e => setForm(p => ({ ...p, teachingAids: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Planned Date</label>
                <Input type="date" value={form.plannedDate} onChange={e => setForm(p => ({ ...p, plannedDate: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Duration (min)</label>
                <Input type="number" placeholder="60" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Status</label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as LessonPlan['status'] }))}>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
            <Button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewPlan} onOpenChange={() => setViewPlan(null)}>
        <DialogContent className="w-full max-w-lg bg-[var(--bg-card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-[var(--text-primary)]">
              <span>{viewPlan?.topic}</span>
              {viewPlan && <Badge className={statusConfig[viewPlan.status]}>{viewPlan?.status}</Badge>}
            </DialogTitle>
          </DialogHeader>
          {viewPlan && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--bg-input)] rounded-lg p-3">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Subject</p>
                  <p className="font-medium text-[var(--text-primary)]">{viewPlan.subject} ({viewPlan.subjectCode})</p>
                </div>
                <div className="bg-[var(--bg-input)] rounded-lg p-3">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Date & Duration</p>
                  <p className="font-medium text-[var(--text-primary)]">{viewPlan.plannedDate} · {viewPlan.durationMins} min</p>
                </div>
              </div>
              {viewPlan.objectives && (
                <div className="bg-[var(--info-bg)] rounded-lg p-3">
                  <p className="text-xs text-[var(--info)] font-semibold mb-1">Objectives</p>
                  <p className="text-[var(--text-primary)]">{viewPlan.objectives}</p>
                </div>
              )}
              {viewPlan.content && (
                <div className="bg-[var(--primary-subtle)] rounded-lg p-3">
                  <p className="text-xs text-[var(--primary)] font-semibold mb-1">Content & Activities</p>
                  <p className="text-[var(--text-primary)]">{viewPlan.content}</p>
                </div>
              )}
              {viewPlan.teachingAids && (
                <div className="bg-[var(--success-bg)] rounded-lg p-3">
                  <p className="text-xs text-[var(--success)] font-semibold mb-1">Teaching Aids</p>
                  <p className="text-[var(--text-primary)]">{viewPlan.teachingAids}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewPlan(null)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
