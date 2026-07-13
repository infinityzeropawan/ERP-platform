'use client';
import { useStudentAttendance } from '../student-attendance_hooks/useStudentAttendance';
import { StudentAttendanceHeader } from './StudentAttendanceHeader';
import { StudentAttendanceFilter } from './StudentAttendanceFilter';
import { StudentAttendanceMatrix } from './StudentAttendanceMatrix';

export function StudentAttendanceMain() {
  const { filter, setFilter, generated, setGenerated, matrixData } = useStudentAttendance();

  return (
    <div className="space-y-6">
      <StudentAttendanceHeader />
      <StudentAttendanceFilter filter={filter} setFilter={setFilter} onGenerate={() => setGenerated(true)} />
      <StudentAttendanceMatrix generated={generated} filter={filter} matrixData={matrixData} />
    </div>
  );
}
