export const TIMETABLE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export type TimetableDay = typeof TIMETABLE_DAYS[number];
