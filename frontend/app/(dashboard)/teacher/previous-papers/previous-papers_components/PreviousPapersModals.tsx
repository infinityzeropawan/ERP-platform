import { FileQuestion } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: { subject: string; year: string; examType: string; pages: string; };
  setForm: (v: any) => void;
  handleUpload: () => void;
}

export function PreviousPapersModals({ open, setOpen, form, setForm, handleUpload }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-md bg-[var(--bg-card)] border-[var(--border)]">
        <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Upload Previous Paper</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Subject *</label>
            <Select value={form.subject} onValueChange={v => setForm((p: any) => ({ ...p, subject: v }))} placeholder="Select Subject">
              <SelectItem value="IOT & Embedded Systems">IOT & Embedded Systems</SelectItem>
              <SelectItem value="Embedded C Programming">Embedded C Programming</SelectItem>
              <SelectItem value="Network Protocols">Network Protocols</SelectItem>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Year *</label>
              <Input placeholder="2025" value={form.year} onChange={e => setForm((p: any) => ({ ...p, year: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Pages</label>
              <Input type="number" placeholder="8" value={form.pages} onChange={e => setForm((p: any) => ({ ...p, pages: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Exam Type *</label>
            <Select value={form.examType} onValueChange={v => setForm((p: any) => ({ ...p, examType: v }))} placeholder="Select type">
              <SelectItem value="Final Exam">Final Exam</SelectItem>
              <SelectItem value="Mid Term">Mid Term</SelectItem>
              <SelectItem value="Unit Test">Unit Test</SelectItem>
            </Select>
          </div>
          <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center">
            <FileQuestion className="h-8 w-8 text-[var(--text-secondary)] mx-auto mb-2 opacity-50" />
            <p className="text-sm text-[var(--text-secondary)]">Click to upload PDF file</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-70">(File upload will work when backend is connected)</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
          <Button onClick={handleUpload} className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">Upload Paper</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
