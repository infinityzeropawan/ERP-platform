'use client';

import { ResourceState } from '@/lib/useResource';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import { useExams } from '../../student_hooks/useExams';
import '../../student.css';

export default function ExamsClient() {
  const { upcomingExams, loading, error } = useExams();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <Award className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />My Exams
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Upcoming examinations schedule</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Upcoming Exams', value: upcomingExams.length, color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-primary)' },
          { label: 'Total Marks', value: upcomingExams.reduce((a, e) => a + e.maxMarks, 0), color: 'var(--student-info)', bg: 'var(--student-info-bg)', border: 'var(--student-info)' },
        ].map((s, i) => (
          <div key={s.label} className="border rounded-2xl p-4 text-center card-hover animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, backgroundColor: s.bg, borderColor: s.border }}>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: 'var(--student-text-secondary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingExams.map((e, i) => (
          <div key={e.id}
            className="rounded-2xl border shadow-sm transition-all duration-300 card-hover overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms`, backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            <div className="h-1 w-full" style={{ backgroundColor: 'var(--student-primary)' }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--student-text-primary)' }}>{e.subject}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--student-text-disabled)' }}>Examination</p>
                </div>
                <Badge style={{ backgroundColor: 'var(--student-info-bg)', color: 'var(--student-info)' }}>{e.maxMarks} Marks</Badge>
              </div>
              <div className="space-y-2 text-sm" style={{ color: 'var(--student-text-secondary)' }}>
                <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" style={{ color: 'var(--student-primary)' }} />{e.date}</p>
                <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" style={{ color: 'var(--student-info)' }} />{e.time} · {e.duration}</p>
                {e.room && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" style={{ color: 'var(--student-success)' }} />{e.room}</p>}
                {e.syllabus && <p className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" style={{ color: 'var(--student-warning)' }} />{e.syllabus}</p>}
              </div>
              <div className="flex items-center gap-2 text-xs rounded-xl p-3 mt-4" style={{ backgroundColor: 'var(--student-bg-input)', color: 'var(--student-text-disabled)' }}>
                <AlertCircle className="h-4 w-4" />Admit card will be issued before the exam
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
