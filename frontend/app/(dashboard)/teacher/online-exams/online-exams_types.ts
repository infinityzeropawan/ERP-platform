export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  marks: number;
}

export interface OnlineExam {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  durationMins: number;
  totalMarks: number;
  passingMarks: number;
  scheduledAt: string;
  status: 'upcoming' | 'live' | 'completed';
  questions: MCQQuestion[];
}

export interface OnlineExamForm {
  title: string;
  subject: string;
  subjectCode: string;
  durationMins: string;
  totalMarks: string;
  passingMarks: string;
  scheduledAt: string;
}
