import { FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PayrollRecord } from '../payroll_types';
import { statusConfig } from '../payroll_hooks/usePayroll';

interface Props {
  payrollRecords: PayrollRecord[];
  onViewSlip: (record: PayrollRecord) => void;
}

export function PayrollList({ payrollRecords, onViewSlip }: Props) {
  return (
    <Card className="border-[var(--border)] bg-[var(--bg-card)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-[var(--text-primary)]">
          <FileText className="h-4 w-4 text-[var(--primary)]" />Salary History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-input)] border-b border-[var(--border)]">
              <tr>
                {['Month', 'Basic', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Slip'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payrollRecords.map(r => {
                return (
                  <tr key={r.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text-primary)]">{r.month} {r.year}</p>
                      {r.paidOn && <p className="text-xs text-[var(--text-secondary)]">Paid: {r.paidOn}</p>}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-primary)]">₹{r.basicSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-[var(--success)] font-medium">+₹0</td>
                    <td className="px-4 py-3 text-[var(--danger)] font-medium">-₹0</td>
                    <td className="px-4 py-3 font-bold text-[var(--primary)]">₹{r.netSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusConfig[r.status as keyof typeof statusConfig]?.variant || 'warning'}>{statusConfig[r.status as keyof typeof statusConfig]?.label || r.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline" onClick={() => onViewSlip(r)} className="flex items-center gap-1 text-xs border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">
                        <Eye className="h-3 w-3" />View
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {payrollRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[var(--text-secondary)] text-xs">No payroll history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
