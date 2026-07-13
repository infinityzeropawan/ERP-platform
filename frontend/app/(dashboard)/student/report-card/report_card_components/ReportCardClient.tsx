'use client';

import { Trophy, TrendingUp, BookOpen, Printer, Star } from 'lucide-react';
import { useReportCard } from @/app/(dashboard)/student/report-card/report_card_hooks/useReportCard;
import '../../student.css';

const gradeColor: Record<string, { text: string; bg: string; border: string }> = {
  'A+': { text: 'var(--student-success)',  bg: 'var(--student-success-bg)',  border: 'var(--student-success)' },
  'A':  { text: 'var(--student-primary)',  bg: 'var(--student-primary-subtle)',  border: 'var(--student-primary)' },
  'B+': { text: 'var(--student-info)',     bg: 'var(--student-info-bg)',     border: 'var(--student-info)' },
  'B':  { text: 'var(--student-info)',     bg: 'var(--student-info-bg)',     border: 'var(--student-info)' },
  'C':  { text: 'var(--student-warning)',  bg: 'var(--student-warning-bg)',  border: 'var(--student-warning)' },
  'F':  { text: 'var(--student-danger)',   bg: 'var(--student-danger-bg)',   border: 'var(--student-danger)' },
};

const getBarColor = (pct: number) => {
  if (pct >= 85) return 'var(--student-success)';
  if (pct >= 70) return 'var(--student-primary)';
  if (pct >= 55) return 'var(--student-warning)';
  return 'var(--student-danger)';
};

export default function ReportCardClient() {
  const { user, reportData, isLoading, totalObtained, totalMax, overallPct, overallGrade } = useReportCard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--student-primary)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between animate-fade-in flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <Trophy className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Report Card
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Academic performance summary</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border shadow-sm"
                  style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}>
            <Printer className="h-4 w-4" />Print
          </button>
          <a href={`/api/v1/admin/pdf/report-card/${user?.id}`} target="_blank" rel="noreferrer"
             className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
             style={{ backgroundColor: 'var(--student-primary)' }}>
            Download PDF
          </a>
        </div>
      </div>

      <div className="rounded-3xl p-6 md:p-8 text-white shadow-lg animate-fade-in-up flex items-center gap-6"
           style={{ background: 'linear-gradient(135deg, var(--student-primary) 0%, #2563eb 100%)' }}>
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold shadow-inner border-2 border-white/30 flex-shrink-0">
          {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
          <p className="text-white/80 text-sm font-medium">{user?.class} · {user?.section} · Roll No: {user?.rollNo || '—'}</p>
        </div>
        <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex flex-col items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-inner">
          <span className="text-xl md:text-2xl font-black">{overallPct}%</span>
          <span className="text-[10px] uppercase font-bold text-white/80">Overall</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Score', value: `${totalObtained}/${totalMax}`, color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-primary)' },
          { label: 'Percentage', value: `${overallPct}%`, color: 'var(--student-info)', bg: 'var(--student-info-bg)', border: 'var(--student-info)' },
          { label: 'Overall Grade', value: overallGrade, color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)' },
          { label: 'Subjects', value: String(reportData.length), color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)' },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 transition-all hover:shadow-md animate-fade-in-up border"
               style={{ backgroundColor: s.bg, borderColor: s.border, animationDelay: `${i * 80}ms` }}>
            <p className="text-xs font-bold uppercase tracking-wide opacity-80" style={{ color: s.color }}>{s.label}</p>
            <p className="text-2xl font-black mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {reportData.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" style={{ color: 'var(--student-text-disabled)' }} />
          <p className="font-semibold" style={{ color: 'var(--student-text-disabled)' }}>No results published yet</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-hover)' }}>
              <TrendingUp className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />
              <h3 className="text-base font-bold" style={{ color: 'var(--student-text-primary)' }}>Subject Performance</h3>
            </div>
            <div className="p-6 space-y-6">
              {reportData.map((r, i) => {
                const gCfg = gradeColor[r.grade] || gradeColor['C'];
                return (
                  <div key={r.subject} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--student-text-primary)' }}>{r.subject}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: 'var(--student-text-secondary)' }}>{r.totalObtained}/{r.totalMax}</span>
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold border"
                              style={{ color: gCfg.text, backgroundColor: gCfg.bg, borderColor: gCfg.border }}>{r.grade}</span>
                      </div>
                    </div>
                    <div className="w-full rounded-full h-2 overflow-hidden bg-gray-100">
                      <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${r.percentage}%`, backgroundColor: getBarColor(r.percentage) }} />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[11px] font-medium" style={{ color: 'var(--student-text-disabled)' }}>{r.remarks}</span>
                      <span className="text-[11px] font-bold" style={{ color: 'var(--student-text-disabled)' }}>{r.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-hover)' }}>
              <BookOpen className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />
              <h3 className="text-base font-bold" style={{ color: 'var(--student-text-primary)' }}>Detailed Marks</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-hover)' }}>
                    <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--student-text-disabled)' }}>Subject</th>
                    <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--student-text-disabled)' }}>UT-1</th>
                    <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--student-text-disabled)' }}>UT-2</th>
                    <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--student-text-disabled)' }}>Mid Term</th>
                    <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--student-text-disabled)' }}>Total</th>
                    <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--student-text-disabled)' }}>Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--student-border)' }}>
                  {reportData.map((r, i) => {
                    const gCfg = gradeColor[r.grade] || gradeColor['C'];
                    return (
                      <tr key={r.subject} className="transition-colors hover:bg-gray-50/50 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                        <td className="px-5 py-4 font-bold" style={{ color: 'var(--student-text-primary)' }}>{r.subject}</td>
                        <td className="text-center px-3 py-4 font-semibold" style={{ color: 'var(--student-text-secondary)' }}>{r.unitTest1 ?? '—'}</td>
                        <td className="text-center px-3 py-4 font-semibold" style={{ color: 'var(--student-text-secondary)' }}>{r.unitTest2 ?? '—'}</td>
                        <td className="text-center px-3 py-4 font-semibold" style={{ color: 'var(--student-text-secondary)' }}>{r.midTerm ?? '—'}</td>
                        <td className="text-center px-3 py-4">
                          <span className="font-black" style={{ color: 'var(--student-primary)' }}>{r.totalObtained}</span>
                          <span className="text-[10px] font-bold ml-1" style={{ color: 'var(--student-text-disabled)' }}>/{r.totalMax}</span>
                        </td>
                        <td className="text-center px-3 py-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold border"
                                style={{ color: gCfg.text, backgroundColor: gCfg.bg, borderColor: gCfg.border }}>{r.grade}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="rounded-2xl p-6 border animate-fade-in-up"
           style={{ backgroundColor: 'var(--student-warning-bg)', borderColor: 'var(--student-warning)' }}>
        <div className="flex items-start gap-4">
          <Star className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: 'var(--student-warning)' }} />
          <div>
            <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--student-warning)' }}>Teacher&apos;s Remarks</p>
            <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--student-text-primary)' }}>
              {user?.name?.split(' ')[0]} has shown {overallPct >= 80 ? 'excellent' : overallPct >= 60 ? 'good' : 'satisfactory'} performance overall.
              {overallPct < 75 ? ' Please focus on improving attendance and exam preparation.' : ' Keep up the great work!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
