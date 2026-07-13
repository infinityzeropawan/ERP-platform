import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { PayrollRecord } from '../payroll_types';

export const statusConfig = {
  paid: { variant: 'success' as const, label: 'Paid' },
  pending: { variant: 'warning' as const, label: 'Pending' },
  processing: { variant: 'info' as const, label: 'Processing' },
};

export function usePayroll() {
  const { token } = useAuth();
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [slipRecord, setSlipRecord] = useState<PayrollRecord | null>(null);

  const fetchPayroll = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/teacher/payroll', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setPayrollRecords(data);
    } catch (err) {
      console.error('Error fetching teacher payrolls:', err);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [token]);

  const latestPaid = payrollRecords.filter(r => r.status === 'paid')[0];
  const totalEarned = payrollRecords.filter(r => r.status === 'paid').reduce((a, r) => a + r.netSalary, 0);

  return {
    payrollRecords,
    slipRecord,
    setSlipRecord,
    latestPaid,
    totalEarned
  };
}
