import { BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AttendanceFilter, StudentMatrix } from '../student-attendance_types';

interface Props {
  generated: boolean;
  filter: AttendanceFilter;
  matrixData: StudentMatrix[];
}

export function StudentAttendanceMatrix({ generated, filter, matrixData }: Props) {
  return (
    <Card className="border-[var(--border)] bg-[var(--bg-card)]">
      <CardContent className="p-8 text-center">
        {!generated ? (
          <div className="flex flex-col items-center gap-3 text-[var(--text-secondary)]">
            <BarChart3 className="h-12 w-12 opacity-50" />
            <p className="text-base font-medium text-[var(--text-primary)]">Select filters and generate report to view the matrix.</p>
            <p className="text-sm">Choose session, class, section, month and year above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-4 text-left">
              Attendance Matrix — {filter.cls || 'IOT-2026'} {filter.section || 'Evening'} | {filter.month || 'July'} {filter.year}
            </p>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--primary-subtle)]">
                  <th className="border border-[var(--border)] px-3 py-2 text-left font-semibold text-[var(--text-primary)]">Student</th>
                  {Array.from({ length: 10 }, (_, i) => (
                    <th key={i} className="border border-[var(--border)] px-2 py-2 font-semibold text-[var(--text-secondary)]">{i + 1}</th>
                  ))}
                  <th className="border border-[var(--border)] px-3 py-2 font-semibold text-[var(--primary)]">%</th>
                </tr>
              </thead>
              <tbody>
                {matrixData.map((data, ri) => {
                  const pct = Math.round((data.attendance.filter(Boolean).length / 10) * 100);
                  return (
                    <tr key={ri} className="hover:bg-[var(--bg-input)]">
                      <td className="border border-[var(--border)] px-3 py-2 font-medium text-[var(--text-primary)] text-left">{data.name}</td>
                      {data.attendance.map((present, ci) => (
                        <td key={ci} className={`border border-[var(--border)] px-2 py-2 text-center font-medium ${present ? 'text-[var(--success)] bg-[var(--success-bg)]' : 'text-[var(--danger)] bg-[var(--danger-bg)]'}`}>
                          {present ? 'P' : 'A'}
                        </td>
                      ))}
                      <td className="border border-[var(--border)] px-3 py-2 text-center font-bold text-[var(--primary)]">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
