import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GradebookEntry } from '../gradebook_types';

interface Props {
  isDetailsOpen: boolean;
  setIsDetailsOpen: (v: boolean) => void;
  selectedEntry: GradebookEntry | null;
  setSelectedEntry: (entry: GradebookEntry | null | ((prev: any) => any)) => void;
  handleSaveDetail: () => void;
}

export function GradebookModals({ isDetailsOpen, setIsDetailsOpen, selectedEntry, setSelectedEntry, handleSaveDetail }: Props) {
  return (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent className="sm:max-w-[450px] bg-[var(--bg-card)] border-[var(--border)]">
        <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Edit Grades: {selectedEntry?.studentName}</DialogTitle></DialogHeader>
        {selectedEntry && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Unit Test 1 (25)</label>
                <Input type="number" value={selectedEntry.unitTest1} onChange={el => setSelectedEntry((p: any) => ({ ...p, unitTest1: Number(el.target.value) }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Unit Test 2 (25)</label>
                <Input type="number" value={selectedEntry.unitTest2} onChange={el => setSelectedEntry((p: any) => ({ ...p, unitTest2: Number(el.target.value) }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Mid Term (100)</label>
                <Input type="number" value={selectedEntry.midTerm} onChange={el => setSelectedEntry((p: any) => ({ ...p, midTerm: Number(el.target.value) }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Assignment (25)</label>
                <Input type="number" value={selectedEntry.assignment} onChange={el => setSelectedEntry((p: any) => ({ ...p, assignment: Number(el.target.value) }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Practical (50)</label>
                <Input type="number" value={selectedEntry.practical} onChange={el => setSelectedEntry((p: any) => ({ ...p, practical: Number(el.target.value) }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Remarks</label>
                <Input value={selectedEntry.remarks || ''} onChange={el => setSelectedEntry((p: any) => ({ ...p, remarks: el.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
          <Button onClick={handleSaveDetail} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
