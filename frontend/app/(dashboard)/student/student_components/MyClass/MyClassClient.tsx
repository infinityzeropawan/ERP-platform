'use client';

import { Users, GraduationCap, BookOpen, Clock } from 'lucide-react';
import { useMyClass } from '../../student_hooks/useMyClass';
import '../../student.css';

export default function MyClassClient() {
  const { classInfo, timetableByDay } = useMyClass();

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <Users className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />My Class
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Class information, teachers, and classmates</p>
      </div>

      <div className="rounded-2xl p-6 text-white shadow-xl animate-scale-in" style={{ background: 'linear-gradient(to bottom right, var(--student-primary), #0f766e)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{classInfo.className}</h2>
            <p className="text-sm opacity-90">{classInfo.section} Section · Academic Year 2026-27</p>
            <div className="flex gap-3 mt-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{classInfo.classmates.length} Classmates</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{classInfo.teachers.length} Instructors</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-page)' }}>
          <BookOpen className="h-4 w-4" style={{ color: 'var(--student-primary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--student-text-primary)' }}>My Teachers ({classInfo.teachers.length})</h3>
        </div>
        {classInfo.teachers.length === 0 ? (
          <div className="p-6 text-center text-xs" style={{ color: 'var(--student-text-disabled)' }}>No teachers assigned yet.</div>
        ) : (
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {classInfo.teachers.map(t => (
              <div key={t.id} className="p-4 rounded-xl border hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--student-primary)' }}>
                    {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--student-text-primary)' }}>{t.name}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--student-primary)' }}>{t.subject}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs" style={{ color: 'var(--student-text-secondary)' }}>
                  <p>🎓 {t.qualification}</p>
                  <p>📧 {t.email}</p>
                  <p>📞 {t.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {timetableByDay.length > 0 && (
        <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up delay-100" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-page)' }}>
            <Clock className="h-4 w-4" style={{ color: 'var(--student-primary)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--student-text-primary)' }}>Weekly Schedule</h3>
          </div>
          <div className="p-5 space-y-2">
            {timetableByDay.map(({ day, periods: dayPeriods }) => (
              <div key={day} className="flex items-center gap-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--student-bg-input)' }}>
                <span className="w-10 text-xs font-bold" style={{ color: 'var(--student-primary)' }}>{day}</span>
                {dayPeriods.map(p => (
                  <div key={p.id} className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--student-text-primary)' }}>{p.subject}</span>
                    <span className="text-xs" style={{ color: 'var(--student-text-secondary)' }}>{p.startTime}–{p.endTime}{p.room ? ` · ${p.room}` : ''}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up delay-200" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-page)' }}>
          <Users className="h-4 w-4" style={{ color: 'var(--student-primary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--student-text-primary)' }}>Classmates ({classInfo.classmates.length})</h3>
        </div>
        {classInfo.classmates.length === 0 ? (
          <div className="p-6 text-center text-xs" style={{ color: 'var(--student-text-disabled)' }}>No classmates registered yet.</div>
        ) : (
          <div className="p-5 grid grid-cols-2 md:grid-cols-5 gap-3">
            {classInfo.classmates.map(s => (
              <div key={s.id} className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors text-center card-hover" style={{ backgroundColor: 'var(--student-bg-input)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: 'var(--student-primary)' }}>
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--student-text-primary)' }}>{s.name.split(' ')[0]}</p>
                  <p className="text-[10px]" style={{ color: 'var(--student-text-secondary)' }}>Roll: {s.rollNo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
