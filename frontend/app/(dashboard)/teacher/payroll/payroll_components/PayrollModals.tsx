import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PayrollRecord } from '../payroll_types';

interface Props {
  slipRecord: PayrollRecord | null;
  setSlipRecord: (v: PayrollRecord | null) => void;
}

export function PayrollModals({ slipRecord, setSlipRecord }: Props) {
  return (
    <Dialog open={!!slipRecord} onOpenChange={() => setSlipRecord(null)}>
      <DialogContent className="w-full max-w-lg bg-[var(--bg-card)] border-[var(--border)]">
        <div className="p-4 space-y-4">
          <div className="text-center border-b border-[var(--border)] pb-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Buildroonix International School</h2>
            <p className="text-xs text-[var(--text-secondary)]">SALARY SLIP FOR THE MONTH OF {slipRecord?.month?.toUpperCase()} {slipRecord?.year}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[var(--text-secondary)]">
            <div>
              <p>Employee Name: <span className="text-[var(--text-primary)]">{slipRecord?.staffName}</span></p>
              <p>Designation: <span className="text-[var(--text-primary)]">{slipRecord?.role}</span></p>
            </div>
            <div className="text-right">
              <p>Payment Date: <span className="text-[var(--text-primary)]">{slipRecord?.paidOn || 'Pending'}</span></p>
              <p>Payment Method: <span className="text-[var(--text-primary)]">{slipRecord?.paymentMethod || 'N/A'}</span></p>
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-2 bg-[var(--bg-input)] border-b border-[var(--border)] font-bold px-3 py-2 text-[var(--text-primary)]">
              <p>Description</p>
              <p className="text-right">Amount (INR)</p>
            </div>
            <div className="px-3 py-2 space-y-1.5 text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <p>Basic Salary</p>
                <p className="font-semibold text-[var(--text-primary)]">₹{slipRecord?.basicSalary?.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex justify-between text-[var(--success)]">
                <p>Allowances</p>
                <p className="font-semibold">+₹0</p>
              </div>
              <div className="flex justify-between text-[var(--danger)]">
                <p>Deductions (TDS/PF)</p>
                <p className="font-semibold">-₹0</p>
              </div>
            </div>
            <div className="grid grid-cols-2 bg-[var(--primary-subtle)] border-t border-[var(--primary-subtle)] font-bold px-3 py-2 text-[var(--primary)]">
              <p>Net Salary Payout</p>
              <p className="text-right">₹{slipRecord?.netSalary?.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setSlipRecord(null)} className="bg-[var(--bg-input)] hover:bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)]">Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
