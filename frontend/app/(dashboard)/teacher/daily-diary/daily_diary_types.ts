export interface DiaryEntry {
  id?: string;
  date: string;
  subject: string;
  classId: string;
  className: string;
  section: string;
  classwork: string;
  homework: string;
  isPublished: boolean;
  teacherName: string;
}

export interface SubjectOption {
  code: string;
  name: string;
}
