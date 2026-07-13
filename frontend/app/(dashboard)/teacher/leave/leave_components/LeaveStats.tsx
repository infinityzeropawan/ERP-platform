import { Card, CardContent } from '@/components/ui/card';
import { LeaveRequest } from '../leave_types';

interface Props {
  leaves: LeaveRequest[];
}

export function LeaveStats({ leaves }: Props) {
  const stats = [
    { label: 'Total Applied', value: leaves.length, color: 'text-[var(--primary)]' },
    { label: 'Approved', value: leaves.filter(l => l.status === 'approved').length, color: 'text-[var(--success)]' },
    { label: 'Pending', value: leaves.filter(l => l.status === 'pending').length, color: 'text-[var(--warning)]' }
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
