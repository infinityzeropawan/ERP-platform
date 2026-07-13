import { useResource } from '@/lib/useResource';

export interface StudentLeaveRequest {
  id: string;
  leaveType: 'sick' | 'casual' | 'emergency' | 'personal';
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  totalDays: number;
  appliedOn: string;
  reviewedBy?: string;
  reviewRemarks?: string;
}

export function useLeave() {
  const { data: rawLeaves, loading, error, create } = useResource<Omit<StudentLeaveRequest, 'totalDays' | 'appliedOn'>>('leaves');

  const leaves: StudentLeaveRequest[] = rawLeaves.map(leave => ({
    ...leave,
    leaveType: leave.leaveType || 'personal',
    totalDays: Math.max(1, Math.round((new Date(leave.toDate).getTime() - new Date(leave.fromDate).getTime()) / 86400000) + 1),
    appliedOn: new Date(leave.createdAt).toLocaleDateString(),
  }));

  const totalDaysCalc = (from: string, to: string) => {
    if (!from || !to) return 0;
    return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1);
  };

  const applyLeave = async (form: { leaveType: string; fromDate: string; toDate: string; reason: string; }) => {
    if (!form.fromDate || !form.toDate || !form.reason.trim()) return false;
    await create({
      leaveType: form.leaveType as any,
      fromDate: form.fromDate,
      toDate: form.toDate,
      reason: form.reason,
      status: 'pending',
    });
    return true;
  };

  return {
    leaves,
    loading,
    error,
    totalDaysCalc,
    applyLeave
  };
}
