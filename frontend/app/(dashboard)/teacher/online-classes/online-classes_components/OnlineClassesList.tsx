import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ExternalLink, Play, Trash2 } from 'lucide-react';
import { OnlineClass } from '../online-classes_types';

interface Props {
  live: OnlineClass[];
  upcoming: OnlineClass[];
  completed: OnlineClass[];
  onDelete: (id: string) => void;
}

export function OnlineClassesList({ live, upcoming, completed, onDelete }: Props) {
  const statusConfig = {
    live: { label: '🔴 LIVE', variant: 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger-bg)]' },
    upcoming: { label: '🕐 Upcoming', variant: 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)] hover:bg-[var(--warning-bg)]' },
    completed: { label: '✅ Completed', variant: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)] hover:bg-[var(--success-bg)]' },
  };

  const ClassCard = ({ cls }: { cls: OnlineClass }) => {
    const cfg = statusConfig[cls.status];
    return (
      <div className={`bg-[var(--bg-card)] rounded-2xl border shadow-sm overflow-hidden ${cls.status === 'live' ? 'border-[var(--danger-border)] ring-2 ring-[var(--danger-border)]' : 'border-[var(--border)]'}`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-[var(--text-primary)] text-sm">{cls.subject}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{cls.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cls.time}</span>
                <span>{cls.duration}</span>
              </div>
            </div>
            <Badge className={cfg.variant}>{cfg.label}</Badge>
          </div>
          <div className="flex gap-2 mt-3">
            {cls.status !== 'completed' ? (
              <a href={cls.meetLink} target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl text-xs font-semibold transition-colors">
                <Play className="h-3.5 w-3.5" />{cls.status === 'live' ? 'Start Class' : 'Open Link'}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <a href={cls.recordingUrl || '#'} target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[var(--bg-input)] hover:bg-[var(--primary-subtle)] text-[var(--text-primary)] rounded-xl text-xs font-semibold transition-colors">
                <Play className="h-3.5 w-3.5" />View Recording
              </a>
            )}
            <button onClick={() => onDelete(cls.id)} className="p-2 rounded-xl bg-[var(--danger-bg)] hover:bg-[var(--danger-border)] text-[var(--danger)] transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {live.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[var(--danger)] uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--danger)] rounded-full animate-pulse" />Live Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{live.map(c => <ClassCard key={c.id} cls={c} />)}</div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-[var(--warning)] uppercase tracking-wide mb-3">Upcoming Classes</h2>
        {upcoming.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">No upcoming classes scheduled.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{upcoming.map(c => <ClassCard key={c.id} cls={c} />)}</div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-3">Completed & Recordings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{completed.map(c => <ClassCard key={c.id} cls={c} />)}</div>
      </div>
    </>
  );
}
