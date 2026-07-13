export interface ParentMessage {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  parentName: string;
  subject: string;
  body: string;
  category: string;
  priority: string;
  isBroadcast: boolean;
  classId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  fatherName: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subjectTemplate: string;
  bodyTemplate: string;
}
