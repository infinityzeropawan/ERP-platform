export type SyllabusStatus = 'completed' | 'in_progress' | 'pending';

export interface SyllabusUnit {
  id: string;
  subject: string;
  subjectCode: string;
  unitNo: number;
  unitTitle: string;
  topics: string[];
  totalHours: number;
  completedHours: number;
  status: SyllabusStatus;
}

export interface SyllabusFormState {
  subject: string;
  subjectCode: string;
  unitTitle: string;
  topics: string;
  totalHours: string;
  completedHours: string;
  status: SyllabusStatus;
}
