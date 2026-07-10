'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function AdminReportsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<any>({
    weeklyAttendance: [],
    monthlyTrend: [],
    subjectPerf: [],
    stats: { students: 0, teachers: 0, classes: 0, collected: 0, pending: 0, overdue: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/v1/admin/reports/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData && !resData.error) {
          setData(resData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading dynamic analytics reports...</div>;
  }

  const { weeklyAttendance, monthlyTrend, subjectPerf, stats } = data;

  const totalUsers = stats.students + stats.teachers + 3; // 3 admins default representation
  const studentPct = Math.round((stats.students / totalUsers) * 100) || 0;
  const teacherPct = Math.round((stats.teachers / totalUsers) * 100) || 0;
  const adminPct = 100 - studentPct - teacherPct;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BarChart3 className="h-6 w-6 text-teal-600" />Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Platform-wide statistics and insights</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-teal-600" />Weekly Attendance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyAttendance} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="present" fill="#0d9488" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-indigo-600" />Student Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="Students" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-500" />Subject Performance (Avg %)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subjectPerf} barSize={30} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                <Tooltip />
                <Bar dataKey="avg" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-purple-500" />User Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {[
                { label: 'Total Students', value: stats.students, color: 'bg-teal-500', pct: studentPct },
                { label: 'Total Teachers', value: stats.teachers, color: 'bg-indigo-500', pct: teacherPct },
                { label: 'Admins', value: 3, color: 'bg-amber-500', pct: adminPct }
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{r.label}</span><span className="font-semibold text-gray-900">{r.value}</span></div>
                  <div className="h-2 bg-gray-100 rounded-full"><div className={`h-2 rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
