export interface LeaveRequest {
  id: string;
  type: string;
  from: string;
  to: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface LeaveForm {
  type: string;
  from: string;
  to: string;
  reason: string;
}
