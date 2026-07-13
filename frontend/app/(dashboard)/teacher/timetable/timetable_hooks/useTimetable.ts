import { useMemo } from 'react';
import { useResource } from '@/lib/useResource';
import { TimetablePeriod, TimetableNotice, TimetableMatrix } from '../timetable_types/timetable_types';
import { TIMETABLE_DAYS } from '../timetable_utils/timetable_constants';
import { TIMETABLE_API_ENDPOINTS } from '../timetable_url_config';

/**
 * Custom hook to fetch and format timetable data.
 */
export function useTimetable() {
  const { data: periods, loading: periodsLoading, error: periodsError } = useResource<TimetablePeriod>(TIMETABLE_API_ENDPOINTS.BASE);
  const { data: notices, loading: noticesLoading, error: noticesError } = useResource<TimetableNotice>(TIMETABLE_API_ENDPOINTS.NOTICES);

  const timetableMatrix = useMemo(() => {
    if (!periods) return {} as TimetableMatrix;

    return Object.fromEntries(
      TIMETABLE_DAYS.map((day, index) => [
        day,
        periods
          .filter((p) => p.dayOfWeek === index + 1)
          .sort((a, b) => a.periodNo - b.periodNo)
          .map((p) => ({
            ...p,
            name: `Period ${p.periodNo}`,
            time: `${p.startTime} – ${p.endTime}`,
            class: `${p.className}${p.section ? ` – ${p.section}` : ''}`,
          })),
      ])
    );
  }, [periods]);

  const maxPeriods = useMemo(() => {
    return Math.max(...TIMETABLE_DAYS.map((d) => (timetableMatrix[d] || []).length), 1);
  }, [timetableMatrix]);

  const holidayNotices = useMemo(() => {
    if (!notices) return [];
    return notices.filter(
      (n) => n.title.toLowerCase().includes('holiday') || n.title.toLowerCase().includes('closed')
    );
  }, [notices]);

  return {
    timetableMatrix,
    maxPeriods,
    holidayNotices,
    loading: periodsLoading || noticesLoading,
    error: periodsError || noticesError,
  };
}
