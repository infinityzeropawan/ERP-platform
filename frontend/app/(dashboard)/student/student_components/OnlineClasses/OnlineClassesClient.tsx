'use client';

import { ResourceState } from '@/lib/useResource';
import { Video, Play, Clock, ExternalLink } from 'lucide-react';
import { useOnlineClasses } from '../../student_hooks/useOnlineClasses';
import '../../student.css';

const statusConfig = {
  live:      { label: '🔴 LIVE',     color: 'var(--student-danger)',  bg: 'var(--student-danger-bg)',  border: 'var(--student-danger)',  btn: 'var(--student-danger)',  btnText: 'Join Now' },
  upcoming:  { label: '🕐 Upcoming', color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)', btn: 'var(--student-warning)', btnText: 'Set Reminder' },
  completed: { label: '✅ Completed', color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)', btn: 'var(--student-primary)', btnText: 'Watch Recording' },
};

export default function OnlineClassesClient() {
  const { live, upcoming, completed, loading, error } = useOnlineClasses();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  const ClassCard = ({ cls }: { cls: any }) => {
    const cfg = statusConfig[cls.status as keyof typeof statusConfig];
    return (
      <div className={`rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${cls.status === 'live' ? 'ring-2' : ''}`}
           style={{ backgroundColor: 'var(--student-bg-card)', borderColor: cls.status === 'live' ? 'var(--student-danger)' : 'var(--student-border)' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
          <span className="text-xs font-bold">{cfg.label}</span>
          <span className="text-xs">{cls.duration}</span>
        </div>
        <div className="p-5">
          <h3 className="text-base font-bold mb-1" style={{ color: 'var(--student-text-primary)' }}>{cls.subject}</h3>
          <p className="text-sm mb-3" style={{ color: 'var(--student-text-secondary)' }}>👨‍🏫 {cls.teacherName}</p>
          <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--student-text-disabled)' }}>
            <span>📅 {cls.date}</span>
            <span>🕐 {cls.time}</span>
          </div>
          <a href={cls.status === 'completed' ? (cls.recordingUrl || '#') : cls.meetLink} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: cfg.btn }}>
            {cls.status === 'live' ? <Play className="h-4 w-4" /> : cls.status === 'completed' ? <Play className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            {cfg.btnText}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <Video className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Online Classes
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Live, upcoming, and recorded classes</p>
      </div>

      {live.length > 0 && (
        <div className="animate-fade-in-up">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'var(--student-danger)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--student-danger)' }} />Live Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map(c => <ClassCard key={c.id} cls={c} />)}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="animate-fade-in-up delay-100">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--student-warning)' }}>Upcoming Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(c => <ClassCard key={c.id} cls={c} />)}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="animate-fade-in-up delay-200">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--student-text-disabled)' }}>Completed & Recordings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map(c => <ClassCard key={c.id} cls={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
