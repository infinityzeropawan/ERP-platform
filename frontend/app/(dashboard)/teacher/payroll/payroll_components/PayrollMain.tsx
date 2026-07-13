'use client';
import { usePayroll } from '../payroll_hooks/usePayroll';
import { PayrollHeader } from './PayrollHeader';
import { PayrollSummary } from './PayrollSummary';
import { PayrollList } from './PayrollList';
import { PayrollModals } from './PayrollModals';

export function PayrollMain() {
  const {
    payrollRecords,
    slipRecord,
    setSlipRecord,
    latestPaid,
    totalEarned
  } = usePayroll();

  return (
    <div className="space-y-6">
      <PayrollHeader />
      <PayrollSummary latestPaid={latestPaid} totalEarned={totalEarned} />
      <PayrollList payrollRecords={payrollRecords} onViewSlip={setSlipRecord} />
      <PayrollModals slipRecord={slipRecord} setSlipRecord={setSlipRecord} />
    </div>
  );
}
