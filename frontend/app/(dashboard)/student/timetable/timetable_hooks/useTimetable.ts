import { useResource } from '@/lib/useResource';
import { useMemo } from 'react';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type TimetablePeriod = {
  id: string;
  name: string;
  time: string;
  subject: string;
  subjectCode?: string;
};

export function useTimetable() {
  const { data: periods, loading: timetableLoading, error: timetableError } = useResource<{
    id: string; dayOfWeek: number; periodNo: number; startTime: string; endTime: string;
    subject: string; subjectCode?: string;
  }>('timetable');

  const { data: notices, loading: noticesLoading, error: noticesError } = useResource<{ id: string; title: string; content: string; publishedAt: string }>('notices');

  const timetable: Record<string, TimetablePeriod[]> = useMemo(() => {
    return Object.fromEntries(DAYS.map((day, index) => [
      day,
      periods
        .filter(period => period.dayOfWeek === index + 1)
        .sort((a, b) => a.periodNo - b.periodNo)
        .map(period => ({ ...period, name: `Period ${period.periodNo}`, time: `${period.startTime} – ${period.endTime}` })),
    ]));
  }, [periods]);

  const maxPeriods = useMemo(() => {
    return Math.max(...DAYS.map(d => (timetable[d] || []).length), 1);
  }, [timetable]);

  const holidays = useMemo(() => {
    return notices.filter(n => n.title.toLowerCase().includes('holiday') || n.title.toLowerCase().includes('closed'));
  }, [notices]);

  return {
    timetable,
    maxPeriods,
    holidays,
    isLoading: timetableLoading || noticesLoading,
    error: timetableError || noticesError
  };
}
