import { useState } from 'react';
import { useResource } from '@/lib/useResource';
import { OnlineClass, OnlineClassForm } from '../online-classes_types';

export function useOnlineClasses() {
  const { data: rawClasses, loading, error, create, remove } = useResource<{
    id: string; subject: string; teacherName: string; startsAt: string; durationMins: number;
    meetingUrl: string; recordingUrl?: string; status: OnlineClass['status'];
  }>('online-classes');

  const classes: OnlineClass[] = rawClasses.map(item => ({
    ...item,
    date: new Date(item.startsAt).toLocaleDateString(),
    time: new Date(item.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: `${item.durationMins} min`,
    meetLink: item.meetingUrl,
  }));

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OnlineClassForm>({ 
    subject: '', title: '', description: '', platform: 'google_meet', meetingLink: '', meetingId: '', date: '', time: '', durationMins: '60' 
  });

  const handleCreate = async () => {
    if (!form.subject || !form.date || !form.time) return;
    await create({
      subject: form.subject, teacherName: 'Assigned teacher',
      startsAt: `${form.date}T${form.time}:00`, durationMins: Number(form.durationMins),
      meetingUrl: form.meetingLink, status: 'upcoming',
      className: 'IOT-2026', section: 'Evening',
    });
    setForm({ subject: '', title: '', description: '', platform: 'google_meet', meetingLink: '', meetingId: '', date: '', time: '', durationMins: '60' });
    setOpen(false);
  };

  const deleteClass = (id: string) => { void remove(id); };

  const live = classes.filter(c => c.status === 'live');
  const upcoming = classes.filter(c => c.status === 'upcoming');
  const completed = classes.filter(c => c.status === 'completed');

  return {
    loading, error,
    classes, live, upcoming, completed,
    open, setOpen,
    form, setForm,
    handleCreate, deleteClass
  };
}
