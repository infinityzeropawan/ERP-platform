import { Card, CardContent } from '@/components/ui/card';
import { LessonPlan } from '../lesson-plans_types';

interface Props {
  plans: LessonPlan[];
}

export function LessonPlansStats({ plans }: Props) {
  const stats = [
    { label: 'Total Plans', value: plans.length, color: 'text-[var(--primary)]' },
    { label: 'Approved', value: plans.filter(p => p.status === 'approved').length, color: 'text-[var(--info)]' },
    { label: 'Completed', value: plans.filter(p => p.status === 'completed').length, color: 'text-[var(--success)]' },
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
