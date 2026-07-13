'use client';

import { Trophy, TrendingUp, Award, BookOpen } from 'lucide-react';
import { useResults } from '../../student_hooks/useResults';
import '../../student.css';

const gradeColor: Record<string, { text: string; bg: string; border: string }> = { 
  'A+': { text: 'var(--student-success)',  bg: 'var(--student-success-bg)',  border: 'var(--student-success)' },
  'A':  { text: 'var(--student-primary)',  bg: 'var(--student-primary-subtle)',  border: 'var(--student-primary)' },
  'B+': { text: 'var(--student-info)',     bg: 'var(--student-info-bg)',     border: 'var(--student-info)' },
  'B':  { text: 'var(--student-info)',     bg: 'var(--student-info-bg)',     border: 'var(--student-info)' },
  'C':  { text: 'var(--student-warning)',  bg: 'var(--student-warning-bg)',  border: 'var(--student-warning)' }
};

const getBarColor = (pct: number) => {
  if (pct >= 80) return 'var(--student-success)';
  if (pct >= 60) return 'var(--student-primary)';
  return 'var(--student-warning)';
};

export default function ResultsClient() {
  const { results, isLoading, examTypes, totalObtained, totalMax, overallPct } = useResults();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--student-primary)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <Trophy className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />My Results
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Academic performance & exam results</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Score', value: `${overallPct}%`, color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-primary)' },
          { label: 'Total Marks', value: `${totalObtained}/${totalMax}`, color: 'var(--student-info)', bg: 'var(--student-info-bg)', border: 'var(--student-info)' },
          { label: 'Exams Taken', value: String(results.length), color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)' },
          { label: 'Best Grade', value: 'A+', color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)' },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 transition-all hover:shadow-md animate-fade-in-up border"
               style={{ backgroundColor: s.bg, borderColor: s.border, animationDelay: `${i * 80}ms` }}>
            <p className="text-xs font-bold uppercase tracking-wide opacity-80" style={{ color: s.color }}>{s.label}</p>
            <p className="text-2xl font-black mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border shadow-sm p-6 animate-fade-in-up" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <TrendingUp className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />Overall Performance
          </p>
          <span className="text-lg font-black" style={{ color: 'var(--student-primary)' }}>{overallPct}%</span>
        </div>
        <div className="w-full rounded-full h-3 bg-gray-100 overflow-hidden">
          <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${overallPct}%`, backgroundColor: 'var(--student-primary)' }} />
        </div>
        <p className="text-xs font-medium mt-3" style={{ color: 'var(--student-text-disabled)' }}>{totalObtained} out of {totalMax} marks obtained</p>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm font-semibold" style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-disabled)' }}>
          No results released yet.
        </div>
      ) : (
        examTypes.map((type, tIdx) => (
          <div key={type} className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)', animationDelay: `${tIdx * 100}ms` }}>
            <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-hover)' }}>
              <Award className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />
              <h3 className="text-base font-bold" style={{ color: 'var(--student-text-primary)' }}>{type}</h3>
            </div>
            <div className="p-6 space-y-4">
              {results.filter(r => r.examType === type).map(r => {
                const pct = Math.round((r.obtainedMarks / r.maxMarks) * 100);
                const gCfg = gradeColor[r.grade] || gradeColor['C'];
                return (
                  <div key={r.id} className="flex items-center gap-4 p-5 rounded-xl transition-colors border"
                       style={{ backgroundColor: 'var(--student-bg-hover)', borderColor: 'var(--student-border)' }}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
                          <BookOpen className="h-4 w-4" style={{ color: 'var(--student-text-disabled)' }} />{r.subject}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold" style={{ color: 'var(--student-text-secondary)' }}>{r.obtainedMarks}/{r.maxMarks}</span>
                          <span className="px-2 py-0.5 rounded-lg text-xs font-bold border"
                                style={{ color: gCfg.text, backgroundColor: gCfg.bg, borderColor: gCfg.border }}>{r.grade}</span>
                        </div>
                      </div>
                      <div className="w-full rounded-full h-2 bg-gray-200 overflow-hidden">
                        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: getBarColor(pct) }} />
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-[11px] font-medium" style={{ color: 'var(--student-text-disabled)' }}>{r.remarks}</p>
                        <p className="text-[11px] font-bold" style={{ color: 'var(--student-text-disabled)' }}>{pct}%</p>
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
