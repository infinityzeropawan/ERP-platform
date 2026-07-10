'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card } from '@/components/ui/card';
import { Trophy, TrendingUp, Award, BookOpen } from 'lucide-react';

const gradeColor: Record<string, string> = { 
  'A+': 'text-green-600 bg-green-50 border-green-200', 
  'A': 'text-teal-600 bg-teal-50 border-teal-200', 
  'B+': 'text-blue-600 bg-blue-50 border-blue-200', 
  'B': 'text-indigo-600 bg-indigo-50 border-indigo-200', 
  'C': 'text-amber-600 bg-amber-50 border-amber-200' 
};

export default function StudentResultsPage() {
  const { token } = useAuth();
  const [results, setResults] = useState<any[]>([]);

  const fetchResults = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/student/results', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setResults(data);
    } catch (err) {
      console.error('Error fetching student results:', err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [token]);

  const examTypes = [...new Set(results.map(r => r.examType))];
  const totalObtained = results.reduce((a, r) => a + r.obtainedMarks, 0);
  const totalMax = results.reduce((a, r) => a + r.maxMarks, 0);
  const overallPct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Trophy className="h-6 w-6 text-teal-600" />My Results</h1>
        <p className="text-gray-500 text-sm mt-0.5">Academic performance & exam results</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Score', value: `${overallPct}%`, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
          { label: 'Total Marks', value: `${totalObtained}/${totalMax}`, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'Exams Taken', value: String(results.length), color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
          { label: 'Best Grade', value: 'A+', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal-600" />Overall Performance</p>
          <span className="text-lg font-bold text-teal-600">{overallPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${overallPct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{totalObtained} out of {totalMax} marks obtained</p>
      </div>

      {/* Results by exam type */}
      {results.length === 0 ? (
        <Card className="p-8 text-center text-gray-400 text-xs border-dashed">No results released yet.</Card>
      ) : (
        examTypes.map(type => (
          <div key={type} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
              <Award className="h-4 w-4 text-teal-600" />
              <h3 className="text-sm font-semibold text-gray-800">{type}</h3>
            </div>
            <div className="p-5 space-y-3">
              {results.filter(r => r.examType === type).map(r => {
                const pct = Math.round((r.obtainedMarks / r.maxMarks) * 100);
                return (
                  <div key={r.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-gray-400" />{r.subject}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-700">{r.obtainedMarks}/{r.maxMarks}</span>
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${gradeColor[r.grade] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>{r.grade}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-700 ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-teal-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-400">{r.remarks}</p>
                        <p className="text-xs text-gray-400">{pct}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
