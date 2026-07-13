import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PayrollRecord } from '../payroll_types';

interface Props {
  latestPaid?: PayrollRecord;
  totalEarned: number;
}

export function PayrollSummary({ latestPaid, totalEarned }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-[var(--primary)] text-white border-0">
        <CardContent className="p-5">
          <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Last Paid Salary</p>
          <p className="text-3xl font-bold mt-1">₹{(latestPaid?.netSalary || 0).toLocaleString('en-IN')}</p>
          <p className="text-white/80 text-xs mt-1">{latestPaid?.month} {latestPaid?.year}</p>
        </CardContent>
      </Card>
      <Card className="border-[var(--border)] bg-[var(--bg-card)]">
        <CardContent className="p-5">
          <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wide">Total Earned (2026)</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">₹{totalEarned.toLocaleString('en-IN')}</p>
          <p className="text-[var(--success)] text-xs mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />All payments received</p>
        </CardContent>
      </Card>
      <Card className="border-[var(--border)] bg-[var(--bg-card)]">
        <CardContent className="p-5">
          <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wide">Basic Salary</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">₹{(latestPaid?.basicSalary || 45000).toLocaleString('en-IN')}</p>
          <p className="text-[var(--text-secondary)] text-xs mt-1">Per month</p>
        </CardContent>
      </Card>
    </div>
  );
}
