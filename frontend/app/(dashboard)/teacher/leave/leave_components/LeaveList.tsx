import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { LeaveRequest } from '../leave_types';

interface Props {
  leaves: LeaveRequest[];
}

export function LeaveList({ leaves }: Props) {
  const statusColor: Record<string, string> = { 
    approved: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)] hover:bg-[var(--success-bg)]', 
    rejected: 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger-bg)]', 
    pending: 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)] hover:bg-[var(--warning-bg)]' 
  };

  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)]">
      <CardHeader className="pb-3 border-b border-[var(--border)]"><CardTitle className="text-base text-[var(--text-primary)]">Leave History</CardTitle></CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-input)] border-b border-[var(--border)]">
            <tr>
              {['Type', 'From', 'To', 'Reason', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)]">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{l.type}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)] flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-[var(--text-secondary)]" />{l.from}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{l.to}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[200px] truncate">{l.reason}</td>
                <td className="px-4 py-3"><Badge className={statusColor[l.status]}>{l.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
