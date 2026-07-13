'use client';

import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, Clock, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { useSyllabus } from '../../student_hooks/useSyllabus';
import '../../student.css';
import { useEffect } from 'react';

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; border: string }> = {
  completed:   { icon: CheckCircle, label: 'Completed',   color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)' },
  in_progress: { icon: Clock,       label: 'In Progress', color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)' },
  pending:     { icon: Circle,      label: 'Upcoming',    color: 'var(--student-text-disabled)', bg: 'var(--student-bg-card)', border: 'var(--student-border)' },
};

const getBarColor = (pct: number) => {
  if (pct >= 75) return 'var(--student-success)';
  if (pct >= 40) return 'var(--student-warning)';
  return 'var(--student-border)';
};

export default function SyllabusClient() {
  const { syllabusUnits, subjects, open, toggleSubject, stats } = useSyllabus();

  // If there are no syllabus units, we show a friendly empty state
  if (syllabusUnits.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <BookOpen className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Syllabus Progress
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Track what has been covered and what's upcoming</p>
        </div>
        <div className="rounded-2xl border border-dashed p-12 text-center" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-card)' }}>
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-20" style={{ color: 'var(--student-text-disabled)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--student-text-disabled)' }}>No syllabus available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <BookOpen className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Syllabus Progress
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Track what has been covered and what's upcoming</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Completed', value: stats.completedCount, color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)' },
          { label: 'In Progress', value: stats.inProgressCount, color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)' },
          { label: 'Upcoming', value: stats.pendingCount, color: 'var(--student-text-secondary)', bg: 'var(--student-bg-card)', border: 'var(--student-border)' },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 text-center transition-all hover:shadow-md animate-fade-in-up border"
               style={{ backgroundColor: s.bg, borderColor: s.border, animationDelay: `${i * 80}ms` }}>
            <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-bold mt-1 uppercase tracking-wider opacity-80" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {subjects.map((code, si) => {
        const units = syllabusUnits.filter(u => u.subjectCode === code);
        const subjectName = units[0]?.subject || code;
        const completedHrs = units.reduce((a, u) => a + u.completedHours, 0);
        const totalHrs = units.reduce((a, u) => a + u.totalHours, 0);
        const pct = totalHrs > 0 ? Math.round((completedHrs / totalHrs) * 100) : 0;
        const isOpen = open[code] ?? true; // default open if not set

        return (
          <div key={code} className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up transition-all"
               style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)', animationDelay: `${si * 100}ms` }}>
            <button onClick={() => toggleSubject(code)}
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--student-bg-hover)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
                     style={{ backgroundColor: 'var(--student-primary-subtle)', borderColor: 'var(--student-primary)' }}>
                  <BookOpen className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm" style={{ color: 'var(--student-text-primary)' }}>{subjectName}</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--student-text-disabled)' }}>{code} · {completedHrs}/{totalHrs} hours covered</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-black" style={{ color: getBarColor(pct) }}>{pct}%</p>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--student-text-disabled)' }}>complete</p>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4" style={{ color: 'var(--student-text-disabled)' }} /> : <ChevronRight className="h-4 w-4" style={{ color: 'var(--student-text-disabled)' }} />}
              </div>
            </button>

            <div className="px-5 py-2 border-b" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
              <div className="w-full rounded-full h-2 overflow-hidden bg-gray-100">
                <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: getBarColor(pct) }} />
              </div>
            </div>

            {isOpen && (
              <div className="divide-y" style={{ borderColor: 'var(--student-border)' }}>
                {units.map((unit, ui) => {
                  const cfg = statusConfig[unit.status] || statusConfig['pending'];
                  const Icon = cfg.icon;
                  const unitPct = unit.totalHours > 0 ? Math.round((unit.completedHours / unit.totalHours) * 100) : 0;
                  return (
                    <div key={unit.id} className="px-5 py-4 transition-colors animate-fade-in hover:bg-gray-50/50" style={{ animationDelay: `${ui * 50}ms` }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border"
                             style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}>
                          <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="text-sm font-bold" style={{ color: 'var(--student-text-primary)' }}>Unit {unit.unitNo}: {unit.unitTitle}</p>
                            <Badge className="flex-shrink-0 text-[10px] py-0"
                                   style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {unit.topics.map(t => (
                              <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                                    style={{ backgroundColor: 'var(--student-bg-hover)', color: 'var(--student-text-secondary)', borderColor: 'var(--student-border)' }}>{t}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 rounded-full h-1.5 overflow-hidden bg-gray-100">
                              <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${unitPct}%`, backgroundColor: cfg.color }} />
                            </div>
                            <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'var(--student-text-disabled)' }}>{unit.completedHours}/{unit.totalHours}h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
