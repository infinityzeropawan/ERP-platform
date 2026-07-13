import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LeaveForm } from '../leave_types';

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: LeaveForm;
  setForm: (v: LeaveForm | ((prev: LeaveForm) => LeaveForm)) => void;
  submit: () => void;
}

export function LeaveModals({ open, setOpen, form, setForm, submit }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px] bg-[var(--bg-card)] border-[var(--border)]">
        <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Apply for Leave</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Leave Type</label>
            <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
              <SelectItem value="Sick Leave">Sick Leave</SelectItem>
              <SelectItem value="Casual Leave">Casual Leave</SelectItem>
              <SelectItem value="Earned Leave">Earned Leave</SelectItem>
              <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">From Date</label>
              <Input type="date" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">To Date</label>
              <Input type="date" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Reason</label>
            <Textarea placeholder="Reason for leave..." value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={3} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
          <Button onClick={submit} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
