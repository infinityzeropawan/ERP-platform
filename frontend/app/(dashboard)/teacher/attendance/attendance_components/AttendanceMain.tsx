'use client';
import { useAttendance } from '../attendance_hooks/useAttendance';
import { AttendanceHeader } from './AttendanceHeader';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceTable } from './AttendanceTable';

export function AttendanceMain() {
  const {
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
  } = useAttendance();

  return (
    <div className="space-y-6">
      <AttendanceHeader />
      <AttendanceFilters 
        date={date} 
        setDate={setDate} 
        period={period} 
        setPeriod={setPeriod} 
        handleFetch={handleFetch} 
      />
      {fetched && (
        <AttendanceTable 
          studentsList={studentsList}
          attendance={attendance}
          presentCount={presentCount}
          absentCount={absentCount}
          toggle={toggle}
          markAll={markAll}
          submitAttendance={submitAttendance}
        />
      )}
    </div>
  );
}
