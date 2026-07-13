// RESPONSIBILITY: Renders the timetable grid matrix.
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { TIMETABLE_DAYS } from '../timetable_utils/timetable_constants';
import { TimetableMatrix } from '../timetable_types/timetable_types';

export interface TimetableGridProps {
  timetableMatrix: TimetableMatrix;
  maxPeriods: number;
}

export default function TimetableGrid({ timetableMatrix, maxPeriods }: TimetableGridProps) {
  return (
    <Card className="bg-bg-card border-border hover:shadow-lg transition-all duration-200">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-20">
                Period
              </th>
              {TIMETABLE_DAYS.map((day) => {
                const count = (timetableMatrix[day] || []).length;
                return (
                  <th
                    key={day}
                    className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide"
                  >
                    <div>{day}</div>
                    {count > 0 && (
                      <span className="inline-block mt-1 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {count}P
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxPeriods }, (_, pi) => (
              <tr key={pi} className="border-b border-border hover:bg-[rgba(99,102,241,0.06)] transition-all duration-200">
                <td className="px-4 py-3 text-xs font-semibold text-text-secondary bg-bg-page/50">
                  P{pi + 1}
                </td>
                {TIMETABLE_DAYS.map((day) => {
                  const period = (timetableMatrix[day] || [])[pi];
                  return (
                    <td key={day} className="px-3 py-3 align-top">
                      {period ? (
                        <div className="bg-primary-subtle border border-primary/20 rounded-xl p-3 min-w-[140px] hover:-translate-y-1 hover:shadow-md transition-all duration-200 ease-in-out cursor-default">
                          <p className="text-xs font-semibold text-primary">{period.name}</p>
                          <p className="text-[11px] text-text-secondary mt-0.5 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {period.time}
                          </p>
                          <p className="text-xs font-medium text-text-primary mt-1">{period.subject}</p>
                          <p className="text-[10px] text-text-secondary">({period.subjectCode})</p>
                          <p className="text-[10px] text-text-secondary mt-1">{period.class}</p>
                        </div>
                      ) : (
                        <div className="h-16 flex items-center justify-center">
                          <span className="text-border text-lg">—</span>
                        </div>
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
  );
}
