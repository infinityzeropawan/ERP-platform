export interface StudentDashboardStats {
  enrolledCourses: number;
  pendingAssignments: number;
  attendanceRate: number;
  upcomingExams: number;
}

export interface StudentDashboardData {
  stats: StudentDashboardStats;
  todayPeriods: any[];
  activeAssignments: any[];
  upcomingExamsList: any[];
  notices: any[];
}
