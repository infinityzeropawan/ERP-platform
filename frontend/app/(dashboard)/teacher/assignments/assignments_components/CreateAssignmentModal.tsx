import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AssignmentForm, Assignment } from '../assignments_types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: AssignmentForm;
  setForm: (val: AssignmentForm | ((prev: AssignmentForm) => AssignmentForm)) => void;
  handleCreate: () => void;
}

export function CreateAssignmentModal({ open, onOpenChange, form, setForm, handleCreate }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg bg-[var(--bg-card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">Create New Assignment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Title *</label>
            <Input 
              placeholder="Assignment title" 
              value={form.title} 
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Subject *</label>
              <Input 
                placeholder="e.g. IOT101" 
                value={form.subject} 
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Max Marks</label>
              <Input 
                type="number" 
                placeholder="100" 
                value={form.maxMarks} 
                onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))}
                className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Due Date *</label>
              <Input 
                type="date" 
                value={form.dueDate} 
                onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Status</label>
              <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as Assignment['status'] }))}>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Description</label>
            <Textarea 
              placeholder="Assignment description..." 
              rows={3} 
              value={form.description} 
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
          <Button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Create Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
