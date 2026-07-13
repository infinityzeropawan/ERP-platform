import { useResource } from '@/lib/useResource';

export interface ParentExam {
  id: string;
  subject: string;
  startsAt: string;
  durationMins: number;
  maxMarks: number;
  room?: string;
  syllabus?: string;
}

export function useAdmitCards() {
  const { data: exams, loading, error } = useResource<ParentExam>('exams');

  const handlePrint = () => {
    window.print();
  };

  return {
    exams,
    loading,
    error,
    handlePrint
  };
}
