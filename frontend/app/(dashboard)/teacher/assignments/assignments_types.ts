export interface Assignment {
  id: string;
  title: string;
  class: string;
  subject: string;
  dueDate: string;
  maxMarks: number;
  status: 'active' | 'closed' | 'draft';
  description: string;
}

export interface RawAssignment {
  id: string;
  title: string;
  className: string;
  subject: string;
  dueAt: string;
  maxMarks: number;
  status: Assignment['status'];
  description: string;
}

export interface AssignmentForm {
  title: string;
  subject: string;
  dueDate: string;
  maxMarks: string;
  description: string;
  status: Assignment['status'];
}
