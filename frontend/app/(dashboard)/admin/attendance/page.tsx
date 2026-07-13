'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { ResourceState, useResource } from '@/lib/useResource';
import { UserCheck, BarChart3, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAttendancePage() {
  const { data: attendance, loading, error } = useResource<{
    id: string; userId: string; date: string; status: string;
  }>('attendance');
  const [studentsList, setStudentsList] = useState<Array<{
    id: string; name: string; class?: string; section?: string; attendance: number;
  }>>([]);
  const [cls, setCls] = useState('IOT-2026');
  const [month, setMonth] = useState('July');
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    fetch('/api/v1/admin/users?role=student')
      .then(response => response.ok ? response.json() : [])
      .then(students => setStudentsList(students.map((student: { id: string; name: string; class?: string; section?: string }) => {
        const records = attendance.filter(record => record.userId === student.id);
        const present = records.filter(record => record.status === 'present').length;
        return { ...student, attendance: records.length ? Math.round(present / records.length * 100) : 0 };
      })));
  }, [attendance]);
  const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => {
    const records = attendance.filter(record => {
      const weekday = new Date(record.date).getDay();
      return weekday === (index + 1);
    });
    return {
      day,
      present: records.filter(record => record.status === 'present').length,
      absent: records.filter(record => record.status !== 'present').length,
    };
  });
  const lowAttendance = studentsList.filter(s => s.attendance < 75);
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><UserCheck className="h-6 w-6 text-teal-600" />Attendance Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">Institution-wide attendance overview and reports</p>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-teal-600" />Weekly Attendance Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barSize={22}>
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

      {/* Low Attendance Alert */}
      {lowAttendance.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-600"><TrendingDown className="h-4 w-4" />Low Attendance Alert ({lowAttendance.length} students below 75%)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-red-50 border-b border-red-100">
                <tr>
                  {['Student', 'Class', 'Attendance %', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-red-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowAttendance.map(s => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-red-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-2.5 text-gray-500">{s.class} · {s.section}</td>
                    <td className="px-4 py-2.5 font-bold text-red-600">{s.attendance}%</td>
                    <td className="px-4 py-2.5"><span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">At Risk</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Class-wise Report */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Class-wise Attendance Matrix</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={cls} onValueChange={setCls}>
                <SelectItem value="IOT-2026">IOT-2026</SelectItem>
                <SelectItem value="CS-2026">CS-2026</SelectItem>
              </Select>
              <Select value={month} onValueChange={setMonth}>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="June">June</SelectItem>
              </Select>
              <Button onClick={() => setGenerated(true)} className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Generate</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!generated ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
              <BarChart3 className="h-12 w-12 text-gray-300" />
              <p className="text-sm">Select class and month, then click Generate</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-teal-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Student</th>
                    {Array.from({ length: 10 }, (_, i) => (
                      <th key={i} className="border border-gray-200 px-2 py-2 font-semibold text-gray-600">{i + 1}</th>
                    ))}
                    <th className="border border-gray-200 px-3 py-2 font-semibold text-teal-700">%</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.map(s => {
                    const studentRecords = attendance.filter(record => record.userId === s.id);
                    const vals = Array.from({ length: 10 }, (_, day) => {
                      const record = studentRecords.find(item => new Date(item.date).getDate() === day + 1);
                      return record?.status === 'present';
                    });
                    const pct = Math.round((vals.filter(Boolean).length / 10) * 100);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 font-medium text-gray-900">{s.name}</td>
                        {vals.map((p, ci) => (
                          <td key={ci} className={`border border-gray-200 px-2 py-2 text-center font-medium ${p ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                            {p ? 'P' : 'A'}
                          </td>
                        ))}
                        <td className={`border border-gray-200 px-3 py-2 text-center font-bold ${pct >= 75 ? 'text-teal-700' : 'text-red-600'}`}>{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
