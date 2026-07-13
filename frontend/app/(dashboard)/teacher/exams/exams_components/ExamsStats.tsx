import { Card, CardContent } from '@/components/ui/card';
import { Exam } from '../exams_types';

interface Props {
  exams: Exam[];
}

export function ExamsStats({ exams }: Props) {
  const stats = [
    { label: 'Total Exams', value: exams.length, color: 'text-[var(--primary)]' },
    { label: 'Scheduled', value: exams.filter(e => e.status === 'scheduled').length, color: 'text-[var(--warning)]' },
    { label: 'Completed', value: exams.filter(e => e.status === 'completed').length, color: 'text-[var(--success)]' },
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
