'use client';

import { ResourceState } from '@/lib/useResource';
import { Clock, Calendar, Sun } from 'lucide-react';
import { useTimetable, DAYS } from @/app/(dashboard)/student/timetable/timetable_hooks/useTimetable;
import '../../student.css';

export default function TimetableClient() {
  const { timetable, maxPeriods, holidays, isLoading, error } = useTimetable();

  if (isLoading || error) return <ResourceState loading={isLoading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <Clock className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />My Weekly Timetable
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Your class schedule for the week</p>
      </div>

      <div className="rounded-2xl border shadow-sm animate-fade-in-up overflow-hidden" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr style={{ background: 'linear-gradient(to right, var(--student-primary), var(--student-info))', color: 'white' }}>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-20 tracking-wider">Period</th>
                {DAYS.map(day => {
                  const count = (timetable[day] || []).length;
                  return (
                    <th key={day} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                      <div>{day}</div>
                      {count > 0 && <span className="inline-block mt-1 bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">{count}P</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxPeriods }, (_, pi) => (
                <tr key={pi} className="border-b transition-colors hover:bg-gray-50/50" style={{ borderColor: 'var(--student-border)' }}>
                  <td className="px-4 py-3 text-xs font-bold" style={{ backgroundColor: 'var(--student-bg-hover)', color: 'var(--student-text-secondary)' }}>P{pi + 1}</td>
                  {DAYS.map(day => {
                    const period = (timetable[day] || [])[pi];
                    return (
                      <td key={day} className="px-3 py-3 align-top">
                        {period ? (
                          <div className="rounded-xl p-3 min-w-[140px] border shadow-sm transition-all hover:shadow-md"
                               style={{ background: 'linear-gradient(to bottom right, var(--student-primary-subtle), var(--student-info-bg))', borderColor: 'var(--student-primary)' }}>
                            <p className="text-xs font-bold" style={{ color: 'var(--student-primary)' }}>{period.name}</p>
                            <p className="text-[11px] mt-1 mb-1 flex items-center gap-1 font-medium" style={{ color: 'var(--student-text-secondary)' }}>
                              <Clock className="h-3 w-3" />{period.time}
                            </p>
                            <p className="text-sm font-bold leading-tight" style={{ color: 'var(--student-text-primary)' }}>{period.subject}</p>
                            {period.subjectCode && (
                              <p className="text-[10px] font-medium" style={{ color: 'var(--student-text-disabled)' }}>({period.subjectCode})</p>
                            )}
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center"><span className="text-lg opacity-20" style={{ color: 'var(--student-text-disabled)' }}>—</span></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border shadow-sm animate-fade-in-up" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-hover)' }}>
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <Sun className="h-5 w-5" style={{ color: 'var(--student-warning)' }} />Upcoming Holidays
          </h3>
        </div>
        <div className="p-5">
          {holidays.length === 0 ? (
            <p className="text-sm font-medium" style={{ color: 'var(--student-text-disabled)' }}>No upcoming holidays found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {holidays.map(h => (
                <div key={h.id} className="flex items-center gap-3 p-4 rounded-xl border transition-colors"
                     style={{ backgroundColor: 'var(--student-warning-bg)', borderColor: 'var(--student-warning)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <Calendar className="h-5 w-5" style={{ color: 'var(--student-warning)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--student-text-primary)' }}>{h.title}</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--student-warning)' }}>{new Date(h.publishedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
