import { useResource } from '@/lib/useResource';

export interface Exam {
  id: string;
  subject: string;
  startsAt: string;
  durationMins: number;
  maxMarks: number;
  room?: string;
  syllabus?: string;
}

export function useExams() {
  const { data: rawExams, loading, error } = useResource<Exam>('exams');
  
  const upcomingExams = rawExams.map(exam => ({
    ...exam,
    date: new Date(exam.startsAt).toLocaleDateString(),
    time: new Date(exam.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: `${exam.durationMins} minutes`,
  }));

  return {
    upcomingExams,
    loading,
    error
  };
}
