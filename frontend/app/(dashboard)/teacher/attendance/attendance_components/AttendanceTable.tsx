import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Users, Check, X } from 'lucide-react';
import { Student, AttendanceStatus } from '../attendance_types';

interface Props {
  studentsList: Student[];
  attendance: Record<string, AttendanceStatus>;
  presentCount: number;
  absentCount: number;
  toggle: (id: string, status: AttendanceStatus) => void;
  markAll: (status: AttendanceStatus) => void;
  submitAttendance: () => void;
}

export function AttendanceTable({
  studentsList,
  attendance,
  presentCount,
  absentCount,
  toggle,
  markAll,
  submitAttendance
}: Props) {
  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)]">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base flex items-center gap-2 text-[var(--text-primary)]">
            <Users className="h-4 w-4 text-[var(--primary)]" />
            Students ({studentsList.length})
            <Badge className="bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)] hover:bg-[var(--success-bg)]">{presentCount} Present</Badge>
            <Badge className="bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger-bg)]">{absentCount} Absent</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => markAll('present')} className="flex items-center gap-1 bg-[var(--success)] hover:bg-[var(--success)]/90 text-white">
              <Check className="h-3.5 w-3.5" />Mark All Present
            </Button>
            <Button size="sm" onClick={() => markAll('absent')} className="flex items-center gap-1 bg-[var(--danger)] hover:bg-[var(--danger)]/90 text-white">
              <X className="h-3.5 w-3.5" />Mark All Absent
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--primary-subtle)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">Roll No</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((student, i) => {
                const status = attendance[student.id] || 'unmarked';
                return (
                  <tr key={student.id} className="border-b border-[var(--border)] hover:bg-[var(--primary-subtle)]/50 transition-colors">
                    <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary-subtle)] flex items-center justify-center text-[var(--primary)] text-xs font-bold border border-[var(--primary)]/20">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{student.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{student.class} · {student.section}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{student.rollNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggle(student.id, 'present')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                            status === 'present'
                              ? 'bg-[var(--success)] text-white shadow-sm'
                              : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--success-bg)] hover:text-[var(--success)] border border-[var(--border)]'
                          }`}
                        >
                          <Check className="h-3 w-3" />Present
                        </button>
                        <button
                          onClick={() => toggle(student.id, 'absent')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                            status === 'absent'
                              ? 'bg-[var(--danger)] text-white shadow-sm'
                              : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)] border border-[var(--border)]'
                          }`}
                        >
                          <X className="h-3 w-3" />Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[var(--border)] flex justify-end">
          <Button onClick={() => void submitAttendance()} className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
            <CheckSquare className="h-4 w-4" />Submit Attendance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
