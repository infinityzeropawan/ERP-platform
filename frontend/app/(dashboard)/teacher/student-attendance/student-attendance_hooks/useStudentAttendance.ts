import { useState, useMemo } from 'react';
import { AttendanceFilter, StudentMatrix } from '../student-attendance_types';

const studentNames = ['Aarav Sharma', 'Priya Patel', 'Rohan Verma', 'Sneha Gupta', 'Karan Singh'];

export function useStudentAttendance() {
  const [filter, setFilter] = useState<AttendanceFilter>({
    session: '2026-2027',
    cls: '',
    section: '',
    month: '',
    year: '2026',
  });
  const [generated, setGenerated] = useState(false);

  const matrixData: StudentMatrix[] = useMemo(() => {
    if (!generated) return [];
    return studentNames.map(name => {
      const vals = Array.from({ length: 10 }, () => Math.random() > 0.3);
      return { name, attendance: vals };
    });
  }, [generated, filter.session, filter.cls, filter.section, filter.month, filter.year]);

  return { filter, setFilter, generated, setGenerated, matrixData };
}
