import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

export type ReportRow = {
  subject: string;
  unitTest1?: number;
  unitTest2?: number;
  midTerm?: number;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: string;
  remarks: string;
};

export function useReportCard() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/student/results')
      .then(r => r.ok ? r.json() : [])
      .then((data: Array<{ subject: string; examType: string; obtainedMarks: number; maxMarks: number; grade: string; remarks: string }>) => {
        const grouped: Record<string, ReportRow> = {};
        data.forEach(r => {
          if (!grouped[r.subject]) {
            grouped[r.subject] = {
              subject: r.subject,
              totalObtained: 0,
              totalMax: 0,
              percentage: 0,
              grade: r.grade,
              remarks: r.remarks
            };
          }
          if (r.examType === 'Unit Test 1') grouped[r.subject].unitTest1 = r.obtainedMarks;
          if (r.examType === 'Unit Test 2') grouped[r.subject].unitTest2 = r.obtainedMarks;
          if (r.examType === 'Mid Term') grouped[r.subject].midTerm = r.obtainedMarks;
          
          grouped[r.subject].totalObtained += r.obtainedMarks;
          grouped[r.subject].totalMax += r.maxMarks;
          grouped[r.subject].grade = r.grade;
          grouped[r.subject].remarks = r.remarks;
        });
        
        const list = Object.values(grouped).map(s => ({
          ...s,
          percentage: s.totalMax ? Math.round((s.totalObtained / s.totalMax) * 100) : 0,
        }));
        setReportData(list);
      })
      .catch(() => setReportData([]))
      .finally(() => setIsLoading(false));
  }, []);

  const totalObtained = reportData.reduce((a, r) => a + r.totalObtained, 0);
  const totalMax = reportData.reduce((a, r) => a + r.totalMax, 0);
  const overallPct = totalMax ? Math.round((totalObtained / totalMax) * 100) : 0;
  
  const overallGrade = overallPct >= 90 ? 'A+' : overallPct >= 80 ? 'A' : overallPct >= 70 ? 'B+' : overallPct >= 60 ? 'B' : 'C';

  return {
    user,
    reportData,
    isLoading,
    totalObtained,
    totalMax,
    overallPct,
    overallGrade
  };
}
