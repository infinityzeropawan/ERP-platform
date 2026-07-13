export interface RawExam {
  id: string;
  subject: string;
  startsAt: string;
  durationMins: number;
  maxMarks: number;
  passingMarks?: number;
  room?: string;
  syllabus?: string;
  status: 'scheduled' | 'completed';
}

export interface Exam extends RawExam {
  date: string;
  time: string;
  duration: string;
  examType: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo?: string;
}

export interface ExamForm {
  subject: string;
  examType: string;
  date: string;
  time: string;
  durationMins: string;
  maxMarks: string;
  passingMarks: string;
  room: string;
  syllabus: string;
}
