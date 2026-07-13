import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onOpenAdd: () => void;
}

export function DailyDiaryHeader({ onOpenAdd }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Daily Class Diary</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Post daily logs of topics covered, classwork assigned, and homework tasks.</p>
      </div>
      <Button onClick={onOpenAdd} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center gap-2 self-start sm:self-auto">
        <Plus className="h-4 w-4" /> Add Diary Entry
      </Button>
    </div>
  );
}
