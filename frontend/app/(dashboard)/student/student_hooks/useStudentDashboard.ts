import { useState, useEffect } from 'react';
import { assignments, notices, upcomingExams, timetable } from '@/lib/mock-data';
import { StudentDashboardData } from '../student_types';

export function useStudentDashboard() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call with mock data
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const todayPeriods = timetable['Mon'] || [];
        const activeAssignments = assignments.filter((a: any) => a.status === 'active');
        
        setData({
          stats: {
            enrolledCourses: 1,
            pendingAssignments: activeAssignments.length,
            attendanceRate: 85,
            upcomingExams: upcomingExams.length
          },
          todayPeriods,
          activeAssignments,
          upcomingExamsList: upcomingExams,
          notices: notices.slice(0, 2)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading };
}
