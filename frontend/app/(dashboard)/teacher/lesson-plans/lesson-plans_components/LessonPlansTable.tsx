import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Eye } from 'lucide-react';
import { LessonPlan } from '../lesson-plans_types';

interface Props {
  plans: LessonPlan[];
  onView: (plan: LessonPlan) => void;
}

export function LessonPlansTable({ plans, onView }: Props) {
  const statusConfig: Record<string, string> = {
    draft: 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)] hover:bg-[var(--warning-bg)]',
    approved: 'bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)] hover:bg-[var(--info-bg)]',
    completed: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)] hover:bg-[var(--success-bg)]',
  };

  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)]">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-input)] border-b border-[var(--border)]">
            <tr>
              {['Topic', 'Subject', 'Planned Date', 'Duration', 'Status', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--text-primary)]">{plan.topic}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-[200px] truncate">{plan.objectives}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[var(--text-primary)] text-xs font-medium">{plan.subject}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{plan.subjectCode}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs">
                    <Calendar className="h-3.5 w-3.5" />{plan.plannedDate}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs">
                    <Clock className="h-3.5 w-3.5" />{plan.durationMins} min
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusConfig[plan.status]}>{plan.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="ghost" onClick={() => onView(plan)} className="flex items-center gap-1 text-xs text-[var(--primary)] hover:bg-[var(--primary-subtle)]">
                    <Eye className="h-3 w-3" />View
                  </Button>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-secondary)] text-xs">No lesson plans found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
