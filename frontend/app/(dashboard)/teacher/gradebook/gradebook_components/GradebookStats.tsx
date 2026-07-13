import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Percent, Trophy } from 'lucide-react';
import { GradebookStats as Stats } from '../gradebook_types';

interface Props {
  stats: Stats;
}

export function GradebookStats({ stats }: Props) {
  const statCards = [
    { label: 'Class Average', value: `${stats.average}%`, icon: Percent, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary-subtle)]' },
    { label: 'Highest Score', value: `${stats.highest}%`, icon: ArrowUp, color: 'text-[var(--success)]', bg: 'bg-[var(--success-bg)]' },
    { label: 'Lowest Score', value: `${stats.lowest}%`, icon: ArrowDown, color: 'text-[var(--danger)]', bg: 'bg-[var(--danger-bg)]' },
    { label: 'Passing Rate', value: `${stats.passRate}%`, icon: Trophy, color: 'text-[var(--info)]', bg: 'bg-[var(--info-bg)]' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {statCards.map(card => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="bg-[var(--bg-card)] border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
