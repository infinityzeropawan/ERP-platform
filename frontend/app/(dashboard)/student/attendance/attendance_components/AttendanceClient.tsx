'use client';

import { ResourceState } from '@/lib/useResource';
import { CheckCircle, XCircle, TrendingUp, AlertTriangle, BookOpen, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAttendance } from @/app/(dashboard)/student/attendance/attendance_hooks/useAttendance;
import '../../student.css';

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ backgroundColor: 'var(--student-bg-input)' }}>
      <div
        className={`h-2.5 rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function AttendanceClient() {
  const { loading, error, monthlyData, subjectAttendance, totalPresent, totalClasses, overall, lowAttendance } = useAttendance();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <CheckCircle className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />My Attendance
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Subject-wise and monthly attendance record</p>
      </div>

      {lowAttendance.length > 0 && (
        <div className="border rounded-2xl p-4 flex items-start gap-3 animate-slide-right" style={{ backgroundColor: 'var(--student-danger-bg)', borderColor: 'var(--student-danger)' }}>
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--student-danger)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--student-danger)' }}>Attendance Warning</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--student-danger)' }}>
              Your attendance in <strong style={{ color: 'var(--student-danger)' }}>{lowAttendance.map(s => s.subjectName).join(', ')}</strong> is below 75%.
              Minimum required attendance is 75% to appear in exams.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border shadow-sm p-6 animate-fade-in-up delay-100" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-primary-subtle)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
              <TrendingUp className="h-4 w-4" style={{ color: 'var(--student-primary)' }} />Overall Attendance
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Academic Year 2026-27</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black" style={{ color: overall >= 75 ? 'var(--student-success)' : 'var(--student-danger)' }}>{overall}%</p>
            <Badge className="mt-1" style={{ backgroundColor: overall >= 75 ? 'var(--student-success-bg)' : 'var(--student-danger-bg)', color: overall >= 75 ? 'var(--student-success)' : 'var(--student-danger)' }}>
              {overall >= 75 ? '✓ Good Standing' : '⚠ Low Attendance'}
            </Badge>
          </div>
        </div>
        <ProgressBar value={totalPresent} max={totalClasses} color={overall >= 75 ? 'var(--student-success)' : 'var(--student-danger)'} />
        <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--student-text-disabled)' }}>
          <span>{totalPresent} classes attended out of {totalClasses}</span>
          <span>Min required: 75%</span>
        </div>
      </div>

      <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up delay-200" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-page)' }}>
          <BookOpen className="h-4 w-4" style={{ color: 'var(--student-primary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--student-text-primary)' }}>Subject-wise Attendance</h3>
        </div>
        <div className="p-5 space-y-5">
          {subjectAttendance.map((s, i) => {
            const isLow = s.percentage < 75;
            const classesNeeded = isLow ? Math.ceil((0.75 * s.totalClasses - s.attended) / 0.25) : 0;
            return (
              <div key={s.subjectCode} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--student-text-primary)' }}>{s.subjectName}</p>
                    <p className="text-xs" style={{ color: 'var(--student-text-secondary)' }}>{s.subjectCode} · {s.teacherName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-black" style={{ color: isLow ? 'var(--student-danger)' : 'var(--student-success)' }}>{s.percentage}%</span>
                    <p className="text-[10px]" style={{ color: 'var(--student-text-disabled)' }}>{s.attended}/{s.totalClasses} classes</p>
                  </div>
                </div>
                <ProgressBar value={s.attended} max={s.totalClasses} color={isLow ? 'var(--student-danger)' : 'var(--student-success)'} />
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--student-text-secondary)' }}>
                    <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" style={{ color: 'var(--student-success)' }} />{s.attended} Present</span>
                    <span className="flex items-center gap-1"><XCircle className="h-3 w-3" style={{ color: 'var(--student-danger)' }} />{s.totalClasses - s.attended} Absent</span>
                  </div>
                  {isLow ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--student-danger-bg)', borderColor: 'var(--student-danger)', color: 'var(--student-danger)' }}>
                      Attend {classesNeeded} more to reach 75%
                    </span>
                  ) : (
                    <span className="text-xs font-medium" style={{ color: 'var(--student-success)' }}>✓ On track</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up delay-300" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-page)' }}>
          <Calendar className="h-4 w-4" style={{ color: 'var(--student-primary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--student-text-primary)' }}>Monthly Breakdown</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {monthlyData.map((m, i) => {
            const pct = Math.round((m.present / m.total) * 100);
            return (
              <div key={m.month} className="p-4 rounded-xl border card-hover animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold" style={{ color: 'var(--student-text-primary)' }}>{m.month} 2026</p>
                  <Badge style={{ backgroundColor: pct >= 75 ? 'var(--student-success-bg)' : 'var(--student-danger-bg)', color: pct >= 75 ? 'var(--student-success)' : 'var(--student-danger)' }}>{pct}%</Badge>
                </div>
                <ProgressBar value={m.present} max={m.total} color={pct >= 75 ? 'var(--student-success)' : 'var(--student-danger)'} />
                <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--student-text-secondary)' }}>
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" style={{ color: 'var(--student-success)' }} />{m.present} Present</span>
                  <span className="flex items-center gap-1"><XCircle className="h-3 w-3" style={{ color: 'var(--student-danger)' }} />{m.total - m.present} Absent</span>
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
