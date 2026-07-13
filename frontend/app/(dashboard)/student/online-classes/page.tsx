'use client';
import { ResourceState, useResource } from '@/lib/useResource';
import { Video, Play, Clock, CheckCircle, ExternalLink } from 'lucide-react';

const statusConfig = {
  live: { label: '🔴 LIVE', color: 'text-red-700 bg-red-50 border-red-200', btn: 'bg-red-500 hover:bg-red-600', btnText: 'Join Now' },
  upcoming: { label: '🕐 Upcoming', color: 'text-amber-700 bg-amber-50 border-amber-200', btn: 'bg-amber-500 hover:bg-amber-600', btnText: 'Set Reminder' },
  completed: { label: '✅ Completed', color: 'text-green-700 bg-green-50 border-green-200', btn: 'bg-teal-500 hover:bg-teal-600', btnText: 'Watch Recording' },
};

export default function OnlineClassesPage() {
  const { data: rawClasses, loading, error } = useResource<{
    id: string; subject: string; teacherName: string; startsAt: string;
    durationMins: number; meetingUrl: string; recordingUrl?: string;
    status: 'live' | 'upcoming' | 'completed';
  }>('online-classes');
  const onlineClasses = rawClasses.map(cls => ({
    ...cls,
    date: new Date(cls.startsAt).toLocaleDateString(),
    time: new Date(cls.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: `${cls.durationMins} min`,
    meetLink: cls.meetingUrl,
  }));
  const live = onlineClasses.filter(c => c.status === 'live');
  const upcoming = onlineClasses.filter(c => c.status === 'upcoming');
  const completed = onlineClasses.filter(c => c.status === 'completed');
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  const ClassCard = ({ cls }: { cls: typeof onlineClasses[0] }) => {
    const cfg = statusConfig[cls.status];
    return (
      <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${cls.status === 'live' ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'}`}>
        <div className={`flex items-center justify-between px-5 py-3 border-b ${cfg.color}`}>
          <span className="text-xs font-bold">{cfg.label}</span>
          <span className="text-xs">{cls.duration}</span>
        </div>
        <div className="p-5">
          <h3 className="text-base font-bold text-gray-900 mb-1">{cls.subject}</h3>
          <p className="text-sm text-gray-500 mb-3">👨‍🏫 {cls.teacherName}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
            <span>📅 {cls.date}</span>
            <span>🕐 {cls.time}</span>
          </div>
          <a href={cls.status === 'completed' ? (cls.recordingUrl || '#') : cls.meetLink} target="_blank" rel="noreferrer"
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${cfg.btn}`}>
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Video className="h-6 w-6 text-teal-600" />Online Classes</h1>
        <p className="text-gray-500 text-sm mt-0.5">Live, upcoming, and recorded classes</p>
      </div>

      {live.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />Live Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map(c => <ClassCard key={c.id} cls={c} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wide mb-3">Upcoming Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map(c => <ClassCard key={c.id} cls={c} />)}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Completed & Recordings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completed.map(c => <ClassCard key={c.id} cls={c} />)}
        </div>
      </div>
    </div>
  );
}
