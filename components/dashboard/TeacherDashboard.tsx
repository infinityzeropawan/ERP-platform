'use client';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { notices, upcomingExams, timetable } from '@/lib/mock-data';
import { Clock, Users, CheckCircle, XCircle, Calendar, BookOpen, MapPin, Bell, Trophy } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const todayPeriods = timetable['Mon'] || [];

  const stats = [
    { label: 'Classes Today', value: '1', icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
    { label: 'My Students', value: '10', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: "Today's Present", value: '0/10', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', progress: 0 },
    { label: "Today's Absent", value: '10/10', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', progress: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{today}</p>
        </div>
        <Badge variant="default" className="self-start sm:self-auto">Teacher Dashboard</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className={`border ${s.border}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
                <div className={`p-1.5 rounded-lg ${s.bg}`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              {s.progress !== undefined && (
                <Progress value={s.progress} max={100} className="mt-2 h-1.5" color={s.progress === 0 ? 'bg-green-500' : 'bg-red-500'} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-teal-600" />Today's Live Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {todayPeriods.length > 0 ? todayPeriods.map(p => (
                <div key={p.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-semibold text-gray-900">{p.name}</span>
                      <Badge variant="default">{p.time}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{p.subject} ({p.subjectCode})</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.class}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-sm text-center py-6">No classes scheduled today</p>
              )}
            </CardContent>
          </Card>

          {/* My Assigned Classes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-teal-600" />My Assigned Classes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class & Section</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Map</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">IOT-2026 – Evening</td>
                      <td className="px-4 py-3"><Badge variant="info">Subject Teacher</Badge></td>
                      <td className="px-4 py-3"><button className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-xs font-medium"><MapPin className="h-3 w-3" />View</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Notice Board */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-amber-500" />Notice Board</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notices.map(n => (
                <div key={n.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.date} · {n.author}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4 text-purple-500" />Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingExams.length > 0 ? upcomingExams.map(e => (
                <div key={e.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100 mb-2">
                  <p className="text-sm font-medium text-gray-900">{e.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.date} · {e.time} · {e.room}</p>
                  <Badge variant="info" className="mt-1">{e.maxMarks} Marks</Badge>
                </div>
              )) : (
                <p className="text-gray-400 text-sm text-center py-4">No upcoming exams</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
