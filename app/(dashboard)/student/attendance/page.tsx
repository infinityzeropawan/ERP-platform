'use client';
import { ResourceState, useResource } from '@/lib/useResource';
import { CheckCircle, XCircle, TrendingUp, AlertTriangle, BookOpen, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function StudentAttendancePage() {
  const { data: records, loading, error } = useResource<{
    id: string; date: string; status: string; subject?: string;
  }>('attendance');
  const monthlyData = Object.values(records.reduce<Record<string, { month: string; present: number; total: number }>>((groups, record) => {
    const month = new Date(record.date).toLocaleString('en', { month: 'long' });
    groups[month] ??= { month, present: 0, total: 0 };
    groups[month].total += 1;
    if (record.status === 'present') groups[month].present += 1;
    return groups;
  }, {}));
  const subjectAttendance = Object.values(records.reduce<Record<string, {
    subjectCode: string; subjectName: string; teacherName: string;
    attended: number; totalClasses: number; percentage: number;
  }>>((groups, record) => {
    const subject = record.subject || 'General';
    groups[subject] ??= {
      subjectCode: subject, subjectName: subject, teacherName: 'Assigned teacher',
      attended: 0, totalClasses: 0, percentage: 0,
    };
    groups[subject].totalClasses += 1;
    if (record.status === 'present') groups[subject].attended += 1;
    groups[subject].percentage = Math.round(groups[subject].attended / groups[subject].totalClasses * 100);
    return groups;
  }, {}));
  const totalPresent = monthlyData.reduce((a, m) => a + m.present, 0);
  const totalClasses = monthlyData.reduce((a, m) => a + m.total, 0);
  const overall = totalClasses ? Math.round((totalPresent / totalClasses) * 100) : 0;
  const lowAttendance = subjectAttendance.filter(s => s.percentage < 75);
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-teal-600" />My Attendance
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Subject-wise and monthly attendance record</p>
      </div>

      {/* Low attendance warning */}
      {lowAttendance.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-slide-right">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Attendance Warning</p>
            <p className="text-xs text-red-600 mt-0.5">
              Your attendance in <strong>{lowAttendance.map(s => s.subjectName).join(', ')}</strong> is below 75%.
              Minimum required attendance is 75% to appear in exams.
            </p>
          </div>
        </div>
      )}

      {/* Overall card */}
      <div className="bg-white rounded-2xl border border-teal-200 shadow-sm p-6 animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-600" />Overall Attendance
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Academic Year 2026-27</p>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-black ${overall >= 75 ? 'text-teal-600' : 'text-red-500'}`}>{overall}%</p>
            <Badge variant={overall >= 75 ? 'success' : 'danger'} className="mt-1">
              {overall >= 75 ? '✓ Good Standing' : '⚠ Low Attendance'}
            </Badge>
          </div>
        </div>
        <ProgressBar value={totalPresent} max={totalClasses} color={overall >= 75 ? 'bg-gradient-to-r from-teal-400 to-teal-600' : 'bg-gradient-to-r from-red-400 to-red-500'} />
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{totalPresent} classes attended out of {totalClasses}</span>
          <span>Min required: 75%</span>
        </div>
      </div>

      {/* Subject-wise */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-200">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
          <BookOpen className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-gray-800">Subject-wise Attendance</h3>
        </div>
        <div className="p-5 space-y-5">
          {subjectAttendance.map((s, i) => {
            const isLow = s.percentage < 75;
            const classesNeeded = isLow
              ? Math.ceil((0.75 * s.totalClasses - s.attended) / 0.25)
              : 0;
            return (
              <div key={s.subjectCode} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{s.subjectName}</p>
                    <p className="text-xs text-gray-400">{s.subjectCode} · {s.teacherName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-lg font-black ${isLow ? 'text-red-500' : 'text-teal-600'}`}>{s.percentage}%</span>
                    <p className="text-[10px] text-gray-400">{s.attended}/{s.totalClasses} classes</p>
                  </div>
                </div>
                <ProgressBar
                  value={s.attended} max={s.totalClasses}
                  color={isLow ? 'bg-gradient-to-r from-red-400 to-red-500' : s.percentage >= 85 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-teal-400 to-teal-600'}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" />{s.attended} Present</span>
                    <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" />{s.totalClasses - s.attended} Absent</span>
                  </div>
                  {isLow ? (
                    <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      Attend {classesNeeded} more to reach 75%
                    </span>
                  ) : (
                    <span className="text-xs text-green-600 font-medium">✓ On track</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-300">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
          <Calendar className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-gray-800">Monthly Breakdown</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {monthlyData.map((m, i) => {
            const pct = Math.round((m.present / m.total) * 100);
            return (
              <div key={m.month} className="p-4 bg-gray-50 rounded-xl border border-gray-100 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">{m.month} 2026</p>
                  <Badge variant={pct >= 75 ? 'success' : 'danger'}>{pct}%</Badge>
                </div>
                <ProgressBar value={m.present} max={m.total} color={pct >= 75 ? 'bg-teal-500' : 'bg-red-500'} />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" />{m.present} Present</span>
                  <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" />{m.total - m.present} Absent</span>
                  <span>{m.total} Total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
