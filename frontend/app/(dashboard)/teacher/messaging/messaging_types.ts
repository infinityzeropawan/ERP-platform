export interface Message {
  id: string;
  studentName: string;
  parentName: string;
  subject: string;
  body: string;
  category: string;
  priority: string;
  createdAt: string;
  isRead: boolean;
}

export interface Student {
  id: string;
  name: string;
  fatherName?: string;
}

export interface ComposeForm {
  studentId: string;
  parentName: string;
  subject: string;
  body: string;
  category: string;
  priority: string;
}
