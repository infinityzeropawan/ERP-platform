import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { OnlineClassForm } from '../online-classes_types';

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: OnlineClassForm;
  setForm: (v: OnlineClassForm | ((prev: OnlineClassForm) => OnlineClassForm)) => void;
  handleCreate: () => void;
}

export function OnlineClassesModals({ open, setOpen, form, setForm, handleCreate }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-lg bg-[var(--bg-card)] border-[var(--border)]">
        <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Schedule Online Class</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Subject *</label>
              <Select value={form.subject} onValueChange={v => setForm(p => ({ ...p, subject: v }))}>
                <SelectItem value="IOT & Embedded Systems">IOT & Embedded Systems</SelectItem>
                <SelectItem value="Embedded C Programming">Embedded C Programming</SelectItem>
                <SelectItem value="Network Protocols">Network Protocols</SelectItem>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Platform</label>
              <Select value={form.platform} onValueChange={v => setForm(p => ({ ...p, platform: v }))}>
                <SelectItem value="google_meet">🟢 Google Meet</SelectItem>
                <SelectItem value="zoom">🔵 Zoom</SelectItem>
                <SelectItem value="teams">🟣 MS Teams</SelectItem>
                <SelectItem value="custom">⚪ Custom</SelectItem>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Meeting Link</label>
            <Input placeholder="https://meet.google.com/..." value={form.meetingLink} onChange={e => setForm(p => ({ ...p, meetingLink: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Date *</label>
              <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Time *</label>
              <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Duration (min)</label>
              <Input type="number" placeholder="60" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
          <Button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Schedule Class</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
