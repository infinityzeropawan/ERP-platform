import { useResource } from '@/lib/useResource';

export interface AttendanceRecord {
  id: string; date: string; status: string; subject?: string;
}

export function useAttendance() {
  const { data: records, loading, error } = useResource<AttendanceRecord>('attendance');

  const monthlyData = Object.values(records.reduce<Record<string, { month: string; present: number; total: number }>>((groups, record) => {
    const month = new Date(record.date).toLocaleString('en', { month: 'long' });
    groups[month] ??= { month, present: 0, total: 0 };
    groups[month].total += 1;
    if (record.status === 'present') groups[month].present += 1;
    return groups;
  }, {}));

  const subjectAttendance = Object.values(records.reduce<Record<string, {
    subjectCode: string; subjectName: string; teacherName: string;
    attended: number; totalClasses: number; percentage: number;
  }>>((groups, record) => {
    const subject = record.subject || 'General';
    groups[subject] ??= {
      subjectCode: subject, subjectName: subject, teacherName: 'Assigned teacher',
      attended: 0, totalClasses: 0, percentage: 0,
    };
    groups[subject].totalClasses += 1;
    if (record.status === 'present') groups[subject].attended += 1;
    groups[subject].percentage = Math.round(groups[subject].attended / groups[subject].totalClasses * 100);
    return groups;
  }, {}));

  const totalPresent = monthlyData.reduce((a, m) => a + m.present, 0);
  const totalClasses = monthlyData.reduce((a, m) => a + m.total, 0);
  const overall = totalClasses ? Math.round((totalPresent / totalClasses) * 100) : 0;
  const lowAttendance = subjectAttendance.filter(s => s.percentage < 75);

  return {
    records,
    loading,
    error,
    monthlyData,
    subjectAttendance,
    totalPresent,
    totalClasses,
    overall,
    lowAttendance
  };
}
