import { IndianRupee } from 'lucide-react';

export function PayrollHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <IndianRupee className="h-6 w-6 text-[var(--primary)]" /> My Payroll
      </h1>
      <p className="text-[var(--text-secondary)] text-sm mt-0.5">Salary slips and payroll history</p>
    </div>
  );
}
