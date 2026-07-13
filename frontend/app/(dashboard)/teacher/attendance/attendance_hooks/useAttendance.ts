import { useState, useEffect } from 'react';
import { useResource } from '@/lib/useResource';
import { Student, AttendanceStatus, AttendanceRecord } from '../attendance_types';

export function useAttendance() {
  const { create } = useResource<AttendanceRecord>('attendance');
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  
  useEffect(() => {
    fetch('/api/v1/teacher/students').then(response => response.json()).then(setStudentsList);
  }, []);

  const [date, setDate] = useState('2026-07-06');
  const [period, setPeriod] = useState('');
  const [fetched, setFetched] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  const handleFetch = () => {
    const initial: Record<string, AttendanceStatus> = {};
    studentsList.forEach(s => { initial[s.id] = 'unmarked'; });
    setAttendance(initial);
    setFetched(true);
  };

  const toggle = (id: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [id]: prev[id] === status ? 'unmarked' : status }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    studentsList.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;

  const submitAttendance = async () => {
    await Promise.all(Object.entries(attendance)
      .filter(([, status]) => status !== 'unmarked')
      .map(([userId, status]) => create({
        userId,
        date,
        status,
        subject: period || 'General',
        className: studentsList.find(student => student.id === userId)?.class,
        section: studentsList.find(student => student.id === userId)?.section,
      })));
  };

  return {
    studentsList,
    date,
    setDate,
    period,
    setPeriod,
    fetched,
    handleFetch,
    attendance,
    toggle,
    markAll,
    presentCount,
    absentCount,
    submitAttendance
  };
}
