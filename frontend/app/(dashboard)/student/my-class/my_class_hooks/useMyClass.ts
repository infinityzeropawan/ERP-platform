import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useResource } from '@/lib/useResource';

export interface Classmate {
  id: string;
  name: string;
  rollNo?: string;
  profileColor?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  email: string;
  phone: string;
}

export interface ClassInfo {
  className: string;
  section: string;
  classmates: Classmate[];
  teachers: Teacher[];
}

export interface TimetablePeriod {
  id: string;
  dayOfWeek: number;
  subject: string;
  startTime: string;
  endTime: string;
  room?: string;
  teacherName?: string;
}

export function useMyClass() {
  const { token } = useAuth();
  const [classInfo, setClassInfo] = useState<ClassInfo>({
    className: 'Loading...',
    section: '',
    classmates: [],
    teachers: []
  });

  const { data: periods, loading: timetableLoading } = useResource<TimetablePeriod>('timetable');

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timetableByDay = DAYS
    .map((day, i) => ({ day, periods: periods.filter(p => p.dayOfWeek === i + 1) }))
    .filter(d => d.periods.length > 0);

  useEffect(() => {
    if (!token) return;
    fetch('/api/v1/student/class-info')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setClassInfo(data); })
      .catch(err => console.error('Error fetching class info:', err));
  }, [token]);

  return {
    classInfo,
    timetableByDay,
    timetableLoading
  };
}
