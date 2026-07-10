'use client';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, Clock, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

type SyllabusUnit = { id: string; subjectCode: string; subject: string; unitNo: number; unitTitle: string; topics: string[]; totalHours: number; completedHours: number; status: 'completed' | 'in_progress' | 'pending'; };
const syllabusUnits: SyllabusUnit[] = [];

const statusConfig = {
  completed:   { variant: 'success' as const, icon: CheckCircle, label: 'Completed',   color: 'text-green-600', bar: 'from-green-400 to-green-600' },
  in_progress: { variant: 'warning' as const, icon: Clock,       label: 'In Progress', color: 'text-amber-600', bar: 'from-amber-400 to-amber-500' },
  pending:     { variant: 'outline' as const, icon: Circle,      label: 'Upcoming',    color: 'text-gray-400',  bar: 'from-gray-200 to-gray-300' },
};

export default function StudentSyllabusPage() {
  const subjects = Array.from(new Set(syllabusUnits.map(u => u.subjectCode)));
  const [open, setOpen] = useState<Record<string, boolean>>(Object.fromEntries(subjects.map(s => [s, true])));

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-teal-600" />Syllabus Progress
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Track what has been covered and what's upcoming</p>
      </div>

      {/* Overall progress */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Completed', value: syllabusUnits.filter(u => u.status === 'completed').length,   color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'In Progress', value: syllabusUnits.filter(u => u.status === 'in_progress').length, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Upcoming', value: syllabusUnits.filter(u => u.status === 'pending').length,      color: 'text-gray-500',  bg: 'bg-gray-50',  border: 'border-gray-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Per subject */}
      {subjects.map((code, si) => {
        const units = syllabusUnits.filter(u => u.subjectCode === code);
        const subjectName = units[0].subject;
        const completedHrs = units.reduce((a, u) => a + u.completedHours, 0);
        const totalHrs = units.reduce((a, u) => a + u.totalHours, 0);
        const pct = Math.round((completedHrs / totalHrs) * 100);
        const isOpen = open[code];

        return (
          <div key={code} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: `${si * 100}ms` }}>
            {/* Subject header */}
            <button onClick={() => setOpen(p => ({ ...p, [code]: !p[code] }))}
              className="w-full flex items-center justify-between px-5 py-4 bg-gray-50/80 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">{subjectName}</p>
                  <p className="text-xs text-gray-400">{code} · {completedHrs}/{totalHrs} hours covered</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-lg font-bold ${pct >= 75 ? 'text-green-600' : pct >= 40 ? 'text-amber-600' : 'text-gray-500'}`}>{pct}%</p>
                  <p className="text-[10px] text-gray-400">complete</p>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
              </div>
            </button>

            {/* Progress bar */}
            <div className="px-5 py-2 bg-gray-50/40 border-b border-gray-100">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full bg-gradient-to-r ${pct >= 75 ? 'from-green-400 to-green-600' : pct >= 40 ? 'from-amber-400 to-amber-500' : 'from-gray-300 to-gray-400'} transition-all duration-1000`}
                  style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* Units */}
            {isOpen && (
              <div className="divide-y divide-gray-50">
                {units.map((unit, ui) => {
                  const cfg = statusConfig[unit.status];
                  const Icon = cfg.icon;
                  const unitPct = Math.round((unit.completedHours / unit.totalHours) * 100);
                  return (
                    <div key={unit.id} className="px-5 py-4 hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${ui * 50}ms` }}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${unit.status === 'completed' ? 'bg-green-100' : unit.status === 'in_progress' ? 'bg-amber-100' : 'bg-gray-100'}`}>
                          <Icon className={`h-4 w-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900">Unit {unit.unitNo}: {unit.unitTitle}</p>
                            <Badge variant={cfg.variant} className="flex-shrink-0 text-[10px] py-0">{cfg.label}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {unit.topics.map(t => (
                              <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{t}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-1.5 rounded-full bg-gradient-to-r ${cfg.bar} transition-all duration-700`} style={{ width: `${unitPct}%` }} />
                            </div>
                            <span className="text-[10px] text-gray-400 flex-shrink-0">{unit.completedHours}/{unit.totalHours}h</span>
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
