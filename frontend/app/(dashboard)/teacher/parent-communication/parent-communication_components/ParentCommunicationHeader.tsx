import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onOpenCompose: () => void;
}

export function ParentCommunicationHeader({ onOpenCompose }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Parent Communication</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Send private notifications, academic alerts, and behavioral notes directly to parents.</p>
      </div>
      <Button onClick={onOpenCompose} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center gap-2 self-start sm:self-auto shadow-md rounded-xl">
        <Plus className="h-4 w-4" /> Compose Message
      </Button>
    </div>
  );
}
