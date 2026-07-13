import { useResource } from '@/lib/useResource';

export interface OnlineClass {
  id: string;
  subject: string;
  teacherName: string;
  startsAt: string;
  durationMins: number;
  meetingUrl: string;
  recordingUrl?: string;
  status: 'live' | 'upcoming' | 'completed';
}

export function useOnlineClasses() {
  const { data: rawClasses, loading, error } = useResource<OnlineClass>('online-classes');
  
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

  return {
    live,
    upcoming,
    completed,
    loading,
    error
  };
}
