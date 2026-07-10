'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { UserCheck, BarChart3 } from 'lucide-react';

export default function StudentAttendancePage() {
  const [session, setSession] = useState('2026-2027');
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('2026');
  const [generated, setGenerated] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-teal-600" />Student Attendance Reports
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Generate attendance matrix for any class and period</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-teal-600" />Filter & Generate Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Session</label>
              <Select value={session} onValueChange={setSession}>
                <SelectItem value="2026-2027">2026-2027</SelectItem>
                <SelectItem value="2025-2026">2025-2026</SelectItem>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Class</label>
              <Select value={cls} onValueChange={setCls} placeholder="Select Class">
                <SelectItem value="IOT-2026">IOT-2026</SelectItem>
                <SelectItem value="CS-2026">CS-2026</SelectItem>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Section</label>
              <Select value={section} onValueChange={setSection} placeholder="Select Section">
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Morning">Morning</SelectItem>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Month</label>
              <Select value={month} onValueChange={setMonth} placeholder="Month">
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Year</label>
              <Select value={year} onValueChange={setYear}>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </Select>
            </div>
            <Button onClick={() => setGenerated(true)} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-8 text-center">
          {!generated ? (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <BarChart3 className="h-12 w-12 text-gray-300" />
              <p className="text-base font-medium">Select filters and generate report to view the matrix.</p>
              <p className="text-sm">Choose session, class, section, month and year above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <p className="text-sm font-semibold text-gray-700 mb-4 text-left">
                Attendance Matrix — {cls || 'IOT-2026'} {section || 'Evening'} | {month || 'July'} {year}
              </p>
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
                  {['Aarav Sharma', 'Priya Patel', 'Rohan Verma', 'Sneha Gupta', 'Karan Singh'].map((name, ri) => {
                    const vals = Array.from({ length: 10 }, () => Math.random() > 0.3);
                    const pct = Math.round((vals.filter(Boolean).length / 10) * 100);
                    return (
                      <tr key={ri} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 font-medium text-gray-900">{name}</td>
                        {vals.map((present, ci) => (
                          <td key={ci} className={`border border-gray-200 px-2 py-2 text-center font-medium ${present ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                            {present ? 'P' : 'A'}
                          </td>
                        ))}
                        <td className="border border-gray-200 px-3 py-2 text-center font-bold text-teal-700">{pct}%</td>
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
