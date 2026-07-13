'use client';

import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, FileText, CheckCircle, Calendar, Bell, Trophy, BookOpen, TrendingUp } from 'lucide-react';
import { useStudentDashboard } from @/app/(dashboard)/student/student_hooks/useStudentDashboard;
import '../../student.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data, loading } = useStudentDashboard();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading || !data) return <div className="p-4" style={{ color: 'var(--student-text-secondary)' }}>Loading Dashboard...</div>;

  const stats = [
    { label: 'Enrolled Courses', value: data.stats.enrolledCourses, icon: BookOpen, color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-border)' },
    { label: 'Pending Assignments', value: data.stats.pendingAssignments, icon: FileText, color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-border)' },
    { label: 'Attendance Rate', value: `${data.stats.attendanceRate}%`, icon: CheckCircle, color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-border)' },
    { label: 'Upcoming Exams', value: data.stats.upcomingExams, icon: Trophy, color: 'var(--student-purple)', bg: 'var(--student-purple-bg)', border: 'var(--student-border)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm mt-0.5 flex items-center gap-1" style={{ color: 'var(--student-text-secondary)' }}>
            <Calendar className="h-3.5 w-3.5" />{today}
          </p>
        </div>
        <Badge variant="info" className="self-start sm:self-auto" style={{ backgroundColor: 'var(--student-info-bg)', color: 'var(--student-info)' }}>Student Dashboard</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={s.label} className="border card-hover animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, borderColor: s.border, backgroundColor: 'var(--student-bg-card)' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium" style={{ color: 'var(--student-text-secondary)' }}>{s.label}</p>
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: s.bg }}><s.icon className="h-4 w-4" style={{ color: s.color }} /></div>
              </div>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Progress */}
      <Card style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
              <TrendingUp className="h-4 w-4" style={{ color: 'var(--student-success)' }} />My Attendance
            </p>
            <span className="text-sm font-bold" style={{ color: 'var(--student-success)' }}>{data.stats.attendanceRate}%</span>
          </div>
          <Progress value={data.stats.attendanceRate} max={100} className="h-2.5" color="bg-[var(--student-success)]" />
          <p className="text-xs mt-1" style={{ color: 'var(--student-text-disabled)' }}>17 out of 20 classes attended</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Today's Classes */}
          <Card style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
                <Clock className="h-4 w-4" style={{ color: 'var(--student-primary)' }} />Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.todayPeriods.length > 0 ? data.todayPeriods.map((p: any) => (
                <div key={p.id} className="flex items-start gap-4 p-4 rounded-xl border mb-3 last:mb-0" style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)' }}>
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--student-primary)' }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-semibold" style={{ color: 'var(--student-text-primary)' }}>{p.subject}</span>
                      <Badge variant="default" style={{ backgroundColor: 'var(--student-primary)', color: 'white' }}>{p.time}</Badge>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>{p.class} · {p.room}</p>
                  </div>
                </div>
              )) : <p className="text-sm text-center py-6" style={{ color: 'var(--student-text-disabled)' }}>No classes today</p>}
            </CardContent>
          </Card>

          {/* Pending Assignments */}
          <Card style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
                <FileText className="h-4 w-4" style={{ color: 'var(--student-warning)' }} />Pending Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.activeAssignments.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--student-warning-bg)', borderColor: 'var(--student-border)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--student-text-primary)' }}>{a.title}</p>
                    <p className="text-xs" style={{ color: 'var(--student-text-secondary)' }}>{a.subject} · Due: {a.dueDate}</p>
                  </div>
                  <Badge variant="warning" style={{ backgroundColor: 'var(--student-warning)', color: 'black' }}>{a.maxMarks} Marks</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
                <Trophy className="h-4 w-4" style={{ color: 'var(--student-purple)' }} />Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.upcomingExamsList.map((e: any) => (
                <div key={e.id} className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--student-purple-bg)', borderColor: 'var(--student-border)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--student-text-primary)' }}>{e.subject}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>{e.date} · {e.time}</p>
                  <Badge variant="info" className="mt-1" style={{ backgroundColor: 'var(--student-purple)', color: 'white' }}>{e.maxMarks} Marks</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
                <Bell className="h-4 w-4" style={{ color: 'var(--student-warning)' }} />Notices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.notices.map((n: any) => (
                <div key={n.id} className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--student-text-primary)' }}>{n.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--student-text-disabled)' }}>{n.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
