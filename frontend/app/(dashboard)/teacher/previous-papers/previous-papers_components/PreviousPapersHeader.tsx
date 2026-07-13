import { FileQuestion, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onOpenCreate: () => void;
}

export function PreviousPapersHeader({ onOpenCreate }: Props) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <FileQuestion className="h-6 w-6 text-[var(--primary)]" />Previous Papers
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Upload and manage previous year question papers</p>
      </div>
      <Button onClick={onOpenCreate} className="flex items-center gap-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
        <Plus className="h-4 w-4" />Upload Paper
      </Button>
    </div>
  );
}
