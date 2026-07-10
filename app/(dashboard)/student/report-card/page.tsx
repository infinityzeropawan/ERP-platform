'use client';
import { useAuth } from '@/lib/AuthContext';
import { useResource, ResourceState } from '@/lib/useResource';
import { Trophy, TrendingUp, BookOpen, Printer, Star } from 'lucide-react';

const gradeColor: Record<string, string> = {
  'A+': 'text-green-700 bg-green-100 border-green-300',
  'A':  'text-teal-700  bg-teal-100  border-teal-300',
  'B+': 'text-blue-700  bg-blue-100  border-blue-300',
  'B':  'text-indigo-700 bg-indigo-100 border-indigo-300',
  'C':  'text-amber-700 bg-amber-100 border-amber-300',
  'F':  'text-red-700   bg-red-100   border-red-300',
};

const barColor = (pct: number) =>
  pct >= 85 ? 'from-green-400 to-green-600' :
  pct >= 70 ? 'from-teal-400 to-teal-600' :
  pct >= 55 ? 'from-amber-400 to-amber-500' : 'from-red-400 to-red-500';

export default function ReportCardPage() {
  const { user } = useAuth();
  const { data: results, loading, error } = useResource<{
    id: string; subject: string; examType: string; obtainedMarks: number; maxMarks: number; grade: string; remarks: string;
  }>('');

  // Group results by subject
  const { data: rawResults, loading: rLoading, error: rError } = useResource<{
    id: string; subject: string; examType: string; obtainedMarks: number; maxMarks: number; grade: string; remarks: string;
  }>('');

  // Use student results endpoint directly
  const [reportData, setReportData] = React.useState<Array<{
    subject: string; unitTest1?: number; unitTest2?: number; midTerm?: number;
    totalObtained: number; totalMax: number; percentage: number; grade: string; remarks: string;
  }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/v1/student/results')
      .then(r => r.ok ? r.json() : [])
      .then((data: Array<{ subject: string; examType: string; obtainedMarks: number; maxMarks: number; grade: string; remarks: string }>) => {
        // Group by subject
        const grouped: Record<string, typeof reportData[0]> = {};
        data.forEach(r => {
          if (!grouped[r.subject]) grouped[r.subject] = { subject: r.subject, totalObtained: 0, totalMax: 0, percentage: 0, grade: r.grade, remarks: r.remarks };
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
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" /></div>;

  const totalObtained = reportData.reduce((a, r) => a + r.totalObtained, 0);
  const totalMax = reportData.reduce((a, r) => a + r.totalMax, 0);
  const overallPct = totalMax ? Math.round((totalObtained / totalMax) * 100) : 0;
  const overallGrade = overallPct >= 90 ? 'A+' : overallPct >= 80 ? 'A' : overallPct >= 70 ? 'B+' : overallPct >= 60 ? 'B' : 'C';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Trophy className="h-6 w-6 text-teal-600" />Report Card</h1>
          <p className="text-gray-500 text-sm mt-0.5">Academic performance summary</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Printer className="h-4 w-4" />Print
          </button>
          <a href={`/api/v1/admin/pdf/report-card/${user?.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-teal-600 border border-teal-700 rounded-xl text-sm font-medium text-white hover:bg-teal-700 transition-all shadow-sm">
            Download PDF
          </a>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 rounded-2xl p-6 text-white shadow-xl animate-fade-in-up">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border-2 border-white/30">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-teal-200 text-sm">{user?.class} · {user?.section} · Roll No: {user?.rollNo || '—'}</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex flex-col items-center justify-center">
            <span className="text-2xl font-black">{overallPct}%</span>
            <span className="text-xs text-teal-200">Overall</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Score', value: `${totalObtained}/${totalMax}`, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
          { label: 'Percentage', value: `${overallPct}%`, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'Overall Grade', value: overallGrade, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'Subjects', value: String(reportData.length), color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {reportData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Trophy className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No results published yet</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
              <TrendingUp className="h-4 w-4 text-teal-600" /><h3 className="text-sm font-semibold text-gray-800">Subject Performance</h3>
            </div>
            <div className="p-5 space-y-4">
              {reportData.map((r, i) => (
                <div key={r.subject} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-900">{r.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700">{r.totalObtained}/{r.totalMax}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${gradeColor[r.grade] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>{r.grade}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-2.5 rounded-full bg-gradient-to-r ${barColor(r.percentage)} transition-all duration-1000`} style={{ width: `${r.percentage}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">{r.remarks}</span>
                    <span className="text-xs font-medium text-gray-500">{r.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
              <BookOpen className="h-4 w-4 text-teal-600" /><h3 className="text-sm font-semibold text-gray-800">Detailed Marks</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">UT-1</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">UT-2</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Mid Term</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reportData.map((r, i) => (
                    <tr key={r.subject} className="hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                      <td className="px-5 py-4 font-semibold text-gray-900">{r.subject}</td>
                      <td className="text-center px-3 py-4 font-semibold text-gray-800">{r.unitTest1 ?? '—'}</td>
                      <td className="text-center px-3 py-4 font-semibold text-gray-800">{r.unitTest2 ?? '—'}</td>
                      <td className="text-center px-3 py-4 font-semibold text-gray-800">{r.midTerm ?? '—'}</td>
                      <td className="text-center px-3 py-4"><span className="font-bold text-teal-700">{r.totalObtained}</span><span className="text-gray-400 text-xs">/{r.totalMax}</span></td>
                      <td className="text-center px-3 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${gradeColor[r.grade] || ''}`}>{r.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Teacher&apos;s Remarks</p>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              {user?.name?.split(' ')[0]} has shown {overallPct >= 80 ? 'excellent' : overallPct >= 60 ? 'good' : 'satisfactory'} performance overall.
              {overallPct < 75 ? ' Please focus on improving attendance and exam preparation.' : ' Keep up the great work!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
