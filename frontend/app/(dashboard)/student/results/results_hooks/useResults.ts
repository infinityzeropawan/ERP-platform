import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

export type ExamResult = {
  id: string;
  subject: string;
  examType: string;
  obtainedMarks: number;
  maxMarks: number;
  grade: string;
  remarks: string;
};

export function useResults() {
  const { token } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    fetch('/api/v1/student/results', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setResults(data))
      .catch(err => console.error('Error fetching student results:', err))
      .finally(() => setIsLoading(false));
  }, [token]);

  const examTypes = [...new Set(results.map(r => r.examType))];
  const totalObtained = results.reduce((a, r) => a + r.obtainedMarks, 0);
  const totalMax = results.reduce((a, r) => a + r.maxMarks, 0);
  const overallPct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return {
    results,
    isLoading,
    examTypes,
    totalObtained,
    totalMax,
    overallPct
  };
}
