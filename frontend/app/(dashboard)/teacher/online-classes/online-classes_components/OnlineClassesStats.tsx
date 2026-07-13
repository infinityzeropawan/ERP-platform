import { Card, CardContent } from '@/components/ui/card';

interface Props {
  liveCount: number;
  upcomingCount: number;
  completedCount: number;
}

export function OnlineClassesStats({ liveCount, upcomingCount, completedCount }: Props) {
  const stats = [
    { label: 'Live Now', value: liveCount, color: 'text-[var(--danger)]' },
    { label: 'Upcoming', value: upcomingCount, color: 'text-[var(--warning)]' },
    { label: 'Completed', value: completedCount, color: 'text-[var(--success)]' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(s => (
        <Card key={s.label} className="bg-[var(--bg-card)] border-[var(--border)]">
          <CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
