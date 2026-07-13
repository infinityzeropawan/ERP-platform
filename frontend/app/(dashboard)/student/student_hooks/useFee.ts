import { useResource } from '@/lib/useResource';

export interface FeeRecord {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  receiptNo?: string;
  paymentMode?: string;
}

export function useFee() {
  const { data: feeRecords, loading, error } = useResource<FeeRecord>('fees');
  
  const paid = feeRecords.filter(f => f.status === 'paid');
  const pending = feeRecords.filter(f => f.status === 'pending');
  const overdue = feeRecords.filter(f => f.status === 'overdue');
  
  const totalPaid = paid.reduce((a, f) => a + f.amount, 0);
  const totalDue = [...pending, ...overdue].reduce((a, f) => a + f.amount, 0);

  return {
    feeRecords,
    paid,
    pending,
    overdue,
    totalPaid,
    totalDue,
    loading,
    error
  };
}
