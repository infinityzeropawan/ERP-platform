'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectItem } from '@/components/ui/select';
import { useResource } from '@/lib/useResource';
import { CheckSquare, Users, Check, X, Calendar } from 'lucide-react';

type AttendanceStatus = 'present' | 'absent' | 'unmarked';

export default function MarkAttendancePage() {
  const { create } = useResource('attendance');
  const [studentsList, setStudentsList] = useState<Array<{
    id: string; name: string; class?: string; section?: string; rollNo?: string;
  }>>([]);
  useEffect(() => {
    fetch('/api/v1/teacher/students').then(response => response.json()).then(setStudentsList);
  }, []);
  const [date, setDate] = useState('2026-07-06');
  const [period, setPeriod] = useState('');
  const [fetched, setFetched] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  const handleFetch = () => {
    const initial: Record<string, AttendanceStatus> = {};
    studentsList.forEach(s => { initial[s.id] = 'unmarked'; });
    setAttendance(initial);
    setFetched(true);
  };

  const toggle = (id: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [id]: prev[id] === status ? 'unmarked' : status }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    studentsList.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;
  const submitAttendance = async () => {
    await Promise.all(Object.entries(attendance)
      .filter(([, status]) => status !== 'unmarked')
      .map(([userId, status]) => create({
        userId, date, status, subject: period || 'General',
        className: studentsList.find(student => student.id === userId)?.class,
        section: studentsList.find(student => student.id === userId)?.section,
      })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><CheckSquare className="h-6 w-6 text-teal-600" />Mark Attendance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Mark daily attendance for your class</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1"><Calendar className="h-3 w-3" />Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="text-xs font-medium text-gray-600">Select Period</label>
              <Select value={period} onValueChange={setPeriod} placeholder="Select Period">
                <SelectItem value="evening">Evening Period (8:30pm)</SelectItem>
                <SelectItem value="morning">Morning Period (9:00am)</SelectItem>
                <SelectItem value="afternoon">Afternoon Period (2:00pm)</SelectItem>
              </Select>
            </div>
            <Button onClick={handleFetch} className="flex items-center gap-2">
              <Users className="h-4 w-4" />Fetch Students
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      {fetched && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-600" />
                Students ({studentsList.length})
                <Badge variant="success">{presentCount} Present</Badge>
                <Badge variant="danger">{absentCount} Absent</Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="success" onClick={() => markAll('present')} className="flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />Mark All Present
                </Button>
                <Button size="sm" variant="destructive" onClick={() => markAll('absent')} className="flex items-center gap-1">
                  <X className="h-3.5 w-3.5" />Mark All Absent
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.map((student, i) => {
                    const status = attendance[student.id] || 'unmarked';
                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-xs text-gray-400">{student.class} · {student.section}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{student.rollNo}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggle(student.id, 'present')}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                status === 'present'
                                  ? 'bg-green-500 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'
                              }`}
                            >
                              <Check className="h-3 w-3" />Present
                            </button>
                            <button
                              onClick={() => toggle(student.id, 'absent')}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                status === 'absent'
                                  ? 'bg-red-500 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-700'
                              }`}
                            >
                              <X className="h-3 w-3" />Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <Button onClick={() => void submitAttendance()} className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />Submit Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
