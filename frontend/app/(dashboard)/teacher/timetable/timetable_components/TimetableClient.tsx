// RESPONSIBILITY: Main client component for the Timetable module.
"use client";

import { ResourceState } from '@/lib/useResource';
import { useTimetable } from '../timetable_hooks/useTimetable';
import TimetableHeader from './TimetableHeader';
import TimetableGrid from './TimetableGrid';
import TimetableHolidayNotices from './TimetableHolidayNotices';

export default function TimetableClient() {
  const { timetableMatrix, maxPeriods, holidayNotices, loading, error } = useTimetable();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <TimetableHeader />
      <TimetableGrid timetableMatrix={timetableMatrix} maxPeriods={maxPeriods} />
      <TimetableHolidayNotices notices={holidayNotices} />
    </div>
  );
}
