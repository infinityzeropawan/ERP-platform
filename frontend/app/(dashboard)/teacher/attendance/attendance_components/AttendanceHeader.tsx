import { CheckSquare } from 'lucide-react';

export function AttendanceHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-[var(--primary)]" />Mark Attendance
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Mark daily attendance for your class</p>
      </div>
    </div>
  );
}
