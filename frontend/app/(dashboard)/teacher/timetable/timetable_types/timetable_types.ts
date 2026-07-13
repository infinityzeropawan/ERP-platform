export interface TimetablePeriod {
  id: string;
  dayOfWeek: number;
  periodNo: number;
  startTime: string;
  endTime: string;
  subject: string;
  subjectCode?: string;
  className: string;
  section?: string;
  room?: string;
  teacherName?: string;
}

export interface TimetableNotice {
  id: string;
  title: string;
  publishedAt: string;
}

export interface FormattedPeriod extends TimetablePeriod {
  name: string;
  time: string;
  class: string;
}

export type TimetableMatrix = Record<string, FormattedPeriod[]>;
