import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onOpenCreate: () => void;
}

export function OnlineExamsHeader({ onOpenCreate }: Props) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-[var(--primary)]" />Online Exams (MCQ)
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Create and manage MCQ-based online examinations</p>
      </div>
      <Button onClick={onOpenCreate} className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
        <Plus className="h-4 w-4" />Create Exam
      </Button>
    </div>
  );
}
