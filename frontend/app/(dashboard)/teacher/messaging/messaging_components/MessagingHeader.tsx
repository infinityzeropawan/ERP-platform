import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onCompose: () => void;
}

export function MessagingHeader({ onCompose }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-[var(--primary)]" />Parent Communication
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Send messages and alerts to parents</p>
      </div>
      <Button onClick={onCompose} className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
        <Send className="h-4 w-4" />New Message
      </Button>
    </div>
  );
}
