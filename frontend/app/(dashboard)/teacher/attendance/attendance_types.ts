export type AttendanceStatus = 'present' | 'absent' | 'unmarked';

export interface Student {
  id: string;
  name: string;
  class?: string;
  section?: string;
  rollNo?: string;
}

export interface AttendanceRecord {
  userId: string;
  date: string;
  status: AttendanceStatus;
  subject: string;
  className?: string;
  section?: string;
}
