'use client';
import { ResourceState, useResource } from '@/lib/useResource';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react';

export default function StudentExamsPage() {
  const { data: rawExams, loading, error } = useResource<{
    id: string; subject: string; startsAt: string; durationMins: number;
    maxMarks: number; room?: string; syllabus?: string;
  }>('exams');
  const upcomingExams = rawExams.map(exam => ({
    ...exam,
    date: new Date(exam.startsAt).toLocaleDateString(),
    time: new Date(exam.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: `${exam.durationMins} minutes`,
  }));
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="h-6 w-6 text-teal-600" />My Exams
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Upcoming examinations schedule</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Upcoming Exams', value: upcomingExams.length, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
          { label: 'Total Marks', value: upcomingExams.reduce((a, e) => a + e.maxMarks, 0), color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingExams.map((e, i) => (
          <div key={e.id}
            className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300 card-hover overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}>
            <div className="h-1 bg-gradient-to-r from-purple-400 to-indigo-500" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{e.subject}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Examination</p>
                </div>
                <Badge variant="info">{e.maxMarks} Marks</Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-purple-400" />{e.date}</p>
                <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-blue-400" />{e.time} · {e.duration}</p>
                {e.room && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-teal-400" />{e.room}</p>}
                {e.syllabus && <p className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-amber-400" />{e.syllabus}</p>}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3 mt-4">
                <AlertCircle className="h-4 w-4" />Admit card will be issued before the exam
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
