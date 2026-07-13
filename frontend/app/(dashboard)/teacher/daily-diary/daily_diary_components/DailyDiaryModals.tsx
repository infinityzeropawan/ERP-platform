import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DiaryEntry, SubjectOption } from '../daily_diary_types';

interface Props {
  isAddOpen: boolean;
  setIsAddOpen: (v: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (v: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (v: boolean) => void;
  activeEntry: DiaryEntry | null;
  setActiveEntry: (e: DiaryEntry | null | ((prev: DiaryEntry | null) => DiaryEntry | null)) => void;
  handleAddSubmit: () => void;
  handleEditSubmit: () => void;
  handleDeleteConfirm: () => void;
  subjectOptions: SubjectOption[];
}

export function DailyDiaryModals({
  isAddOpen, setIsAddOpen,
  isEditOpen, setIsEditOpen,
  isDeleteOpen, setIsDeleteOpen,
  activeEntry, setActiveEntry,
  handleAddSubmit, handleEditSubmit, handleDeleteConfirm,
  subjectOptions
}: Props) {
  
  const FormFields = () => {
    if (!activeEntry) return null;
    return (
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Date</label>
            <Input 
              type="date" 
              value={activeEntry.date} 
              onChange={e => setActiveEntry((p: any) => ({ ...p, date: e.target.value }))}
              className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Class Target</label>
            <Input 
              placeholder="Class-X" 
              value={activeEntry.className} 
              onChange={e => setActiveEntry((p: any) => ({ ...p, className: e.target.value, classId: `${e.target.value}-${p.section || 'A'}` }))}
              className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Section</label>
            <Input 
              placeholder="A" 
              value={activeEntry.section} 
              onChange={e => setActiveEntry((p: any) => ({ ...p, section: e.target.value, classId: `${p.className || 'Class-X'}-${e.target.value}` }))}
              className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Subject</label>
            <select
              value={activeEntry.subject}
              onChange={e => setActiveEntry((p: any) => ({ ...p, subject: e.target.value }))}
              className="w-full h-10 px-3 border border-[var(--border)] rounded-lg bg-[var(--bg-input)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              {subjectOptions.map(o => (
                <option key={o.code} value={o.code}>{o.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">Classwork Details *</label>
          <Textarea 
            placeholder="Describe the topics covered in class today..." 
            value={activeEntry.classwork} 
            onChange={e => setActiveEntry((p: any) => ({ ...p, classwork: e.target.value }))}
            className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] min-h-[80px]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">Homework Task</label>
          <Textarea 
            placeholder="Enter instructions for homework assignment..." 
            value={activeEntry.homework} 
            onChange={e => setActiveEntry((p: any) => ({ ...p, homework: e.target.value }))}
            className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] min-h-[80px]"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[var(--bg-card)] border-[var(--border)]">
          <DialogHeader><DialogTitle className="text-[var(--text-primary)]">New Class Diary Entry</DialogTitle></DialogHeader>
          <FormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
            <Button onClick={handleAddSubmit} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Save Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[var(--bg-card)] border-[var(--border)]">
          <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Edit Class Diary Entry</DialogTitle></DialogHeader>
          <FormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
            <Button onClick={handleEditSubmit} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[var(--bg-card)] border-[var(--border)]">
          <DialogHeader><DialogTitle className="text-[var(--text-primary)]">Delete Class Diary Entry</DialogTitle></DialogHeader>
          <div className="py-2 text-xs font-semibold text-[var(--text-secondary)]">
            Are you sure you want to delete this diary entry? This action is permanent and cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">Cancel</Button>
            <Button onClick={handleDeleteConfirm} className="bg-[var(--danger)] hover:bg-[var(--danger)]/90 text-white">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
