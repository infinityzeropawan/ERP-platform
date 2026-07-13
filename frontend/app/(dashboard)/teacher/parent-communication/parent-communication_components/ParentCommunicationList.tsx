import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar } from 'lucide-react';
import { ParentMessage } from '../parent-communication_types';

interface Props {
  messages: ParentMessage[];
  onOpenDetails: (msg: ParentMessage) => void;
}

export function ParentCommunicationList({ messages, onOpenDetails }: Props) {
  return (
    <div className="space-y-4">
      {messages.map(m => {
        const catColors = 
          m.category === 'attendance' ? 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]' :
          m.category === 'behavior' ? 'bg-[var(--primary-subtle)] text-[var(--primary)] border-[var(--primary)]' :
          m.category === 'academic' ? 'bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]' :
          m.category === 'fee' ? 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]' :
          'bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border)]';

        const priorityColors =
          m.priority === 'urgent' ? 'bg-[var(--danger)] text-white shadow-sm' :
          m.priority === 'important' ? 'bg-[var(--warning)] text-white shadow-sm' :
          'bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border)]';

        return (
          <Card key={m.id} className="hover:shadow-md transition-shadow cursor-pointer rounded-2xl border-[var(--border)] bg-[var(--bg-card)]" onClick={() => onOpenDetails(m)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${catColors}`}>
                    {m.category.charAt(0).toUpperCase() + m.category.slice(1)}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${priorityColors}`}>
                    {m.priority}
                  </span>
                  {m.isBroadcast && (
                    <Badge className="bg-[var(--primary)] text-white flex items-center gap-1 text-[10px] py-0 px-2 rounded-lg">
                      <Users className="h-3 w-3" /> Class Broadcast
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] line-clamp-1">{m.subject}</h3>
                <p className="text-sm font-semibold text-[var(--text-secondary)] mt-0.5">
                  {m.isBroadcast ? 'To: All Parents' : `To: ${m.parentName} (${m.studentName}'s parent)`}
                </p>
              </div>

              <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed bg-[var(--bg-input)] p-2.5 rounded-xl border border-[var(--border)] font-mono text-[13px]">
                {m.body}
              </p>

              <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] pt-1">
                <span>Sent dynamically from Portal</span>
                <span className="text-[var(--primary)] font-semibold hover:underline">View details →</span>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {messages.length === 0 && (
        <div className="text-center py-12 text-[var(--text-secondary)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)]">
          No parent communications logged.
        </div>
      )}
    </div>
  );
}
