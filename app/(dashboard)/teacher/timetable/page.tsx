'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceState, useResource } from '@/lib/useResource';
import { Clock, Calendar, Sun } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TimetablePage() {
  const { data: periods, loading, error } = useResource<{
    id: string; dayOfWeek: number; periodNo: number; startTime: string; endTime: string;
    subject: string; subjectCode?: string; className: string; section?: string;
    room?: string; teacherName?: string;
  }>('timetable');
  const { data: notices } = useResource<{ id: string; title: string; publishedAt: string }>('notices');

  const timetable: Record<string, Array<{ id: string; name: string; time: string; subject: string; subjectCode?: string; class: string; room?: string }>> =
    Object.fromEntries(DAYS.map((day, index) => [
      day,
      periods
        .filter(p => p.dayOfWeek === index + 1)
        .sort((a, b) => a.periodNo - b.periodNo)
        .map(p => ({ ...p, name: `Period ${p.periodNo}`, time: `${p.startTime} – ${p.endTime}`, class: `${p.className}${p.section ? ` – ${p.section}` : ''}` })),
    ]));
  const maxPeriods = Math.max(...DAYS.map(d => (timetable[d] || []).length), 1);
  const holidayNotices = notices.filter(n => n.title.toLowerCase().includes('holiday') || n.title.toLowerCase().includes('closed'));

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="h-6 w-6 text-teal-600" />My Weekly Timetable
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Your scheduled classes for the week</p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-20">Period</th>
                {DAYS.map(day => {
                  const count = (timetable[day] || []).length;
                  return (
                    <th key={day} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                      <div>{day}</div>
                      {count > 0 && <span className="inline-block mt-1 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">{count}P</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxPeriods }, (_, pi) => (
                <tr key={pi} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-semibold text-gray-500 bg-gray-50">P{pi + 1}</td>
                  {DAYS.map(day => {
                    const period = (timetable[day] || [])[pi];
                    return (
                      <td key={day} className="px-3 py-3 align-top">
                        {period ? (
                          <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-3 min-w-[140px]">
                            <p className="text-xs font-semibold text-teal-700">{period.name}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{period.time}</p>
                            <p className="text-xs font-medium text-gray-800 mt-1">{period.subject}</p>
                            <p className="text-[10px] text-gray-400">({period.subjectCode})</p>
                            <p className="text-[10px] text-gray-500 mt-1">{period.class}</p>
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center"><span className="text-gray-200 text-lg">—</span></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {holidayNotices.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Sun className="h-4 w-4 text-amber-500" />Holiday Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {holidayNotices.map(h => (
                <div key={h.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0"><Calendar className="h-4 w-4 text-amber-600" /></div>
                  <div><p className="text-sm font-medium text-gray-900">{h.title}</p><p className="text-xs text-amber-600">{new Date(h.publishedAt).toLocaleDateString()}</p></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
