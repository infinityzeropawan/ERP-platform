'use client';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { assignments, notices, upcomingExams, timetable } from '@/lib/mock-data';
import { Clock, FileText, CheckCircle, Calendar, Bell, Trophy, BookOpen, TrendingUp } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const todayPeriods = timetable['Mon'] || [];
  const activeAssignments = assignments.filter(a => a.status === 'active');

  const stats = [
    { label: 'Enrolled Courses', value: '1', icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
    { label: 'Pending Assignments', value: String(activeAssignments.length), icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { label: 'Attendance Rate', value: '85%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'Upcoming Exams', value: String(upcomingExams.length), icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{today}</p>
        </div>
        <Badge variant="info" className="self-start sm:self-auto">Student Dashboard</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={s.label} className={`border ${s.border} card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
                <div className={`p-1.5 rounded-lg ${s.bg}`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal-600" />My Attendance</p>
            <span className="text-sm font-bold text-teal-600">85%</span>
          </div>
          <Progress value={85} max={100} className="h-2.5" color="bg-teal-500" />
          <p className="text-xs text-gray-400 mt-1">17 out of 20 classes attended</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Today's Classes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-teal-600" />Today's Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {todayPeriods.length > 0 ? todayPeriods.map(p => (
                <div key={p.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-semibold text-gray-900">{p.subject}</span>
                      <Badge variant="default">{p.time}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{p.class} · {p.room}</p>
                  </div>
                </div>
              )) : <p className="text-gray-400 text-sm text-center py-6">No classes today</p>}
            </CardContent>
          </Card>

          {/* Pending Assignments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-orange-500" />Pending Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAssignments.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.subject} · Due: {a.dueDate}</p>
                  </div>
                  <Badge variant="warning">{a.maxMarks} Marks</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4 text-purple-500" />Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingExams.map(e => (
                <div key={e.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm font-medium text-gray-900">{e.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.date} · {e.time}</p>
                  <Badge variant="info" className="mt-1">{e.maxMarks} Marks</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-amber-500" />Notices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notices.slice(0, 2).map(n => (
                <div key={n.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
