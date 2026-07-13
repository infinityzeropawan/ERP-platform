import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, BookOpen, Award } from 'lucide-react';
import { Assignment } from '../assignments_types';

interface Props {
  assignments: Assignment[];
}

export function AssignmentsList({ assignments }: Props) {
  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)]">
      <CardContent className="p-0">
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-[var(--text-secondary)]">
            <FileText className="h-12 w-12 text-[var(--border)]" />
            <p className="text-base font-medium">No assignments found</p>
            <p className="text-sm">Create your first assignment using the button above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--primary-subtle)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">Title & Class</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">Due Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">Max Marks</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.id} className="border-b border-[var(--border)] hover:bg-[var(--primary-subtle)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text-primary)]">{a.title}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{a.class}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                        <BookOpen className="h-3.5 w-3.5 text-[var(--primary)]" />{a.subject}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                        <Calendar className="h-3.5 w-3.5 text-[var(--warning)]" />{a.dueDate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                        <Award className="h-3.5 w-3.5 text-[var(--purple)]" />{a.maxMarks}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={a.status === 'active' ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]' : a.status === 'closed' ? 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]' : 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]'}>
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
