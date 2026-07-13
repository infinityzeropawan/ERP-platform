import { UserCheck } from 'lucide-react';

export function StudentAttendanceHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <UserCheck className="h-6 w-6 text-[var(--primary)]" />Student Attendance Reports
      </h1>
      <p className="text-[var(--text-secondary)] text-sm mt-0.5">Generate attendance matrix for any class and period</p>
    </div>
  );
}
