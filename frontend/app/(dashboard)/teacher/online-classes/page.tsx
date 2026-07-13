'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ResourceState, useResource } from '@/lib/useResource';
import { Video, Plus, Calendar, Clock, ExternalLink, Play, Trash2 } from 'lucide-react';

const platformIcons: Record<string, string> = { google_meet: '🟢', zoom: '🔵', teams: '🟣', custom: '⚪' };

const statusConfig = {
  live: { label: '🔴 LIVE', variant: 'danger' as const },
  upcoming: { label: '🕐 Upcoming', variant: 'warning' as const },
  completed: { label: '✅ Completed', variant: 'success' as const },
};

export default function TeacherOnlineClassesPage() {
  type OnlineClass = {
    id: string; subject: string; teacherName: string; date: string; time: string;
    duration: string; meetLink: string; recordingUrl?: string;
    status: 'live' | 'upcoming' | 'completed';
  };
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
  const [form, setForm] = useState({ subject: '', title: '', description: '', platform: 'google_meet', meetingLink: '', meetingId: '', date: '', time: '', durationMins: '60' });

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
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  const ClassCard = ({ cls }: { cls: OnlineClass }) => {
    const cfg = statusConfig[cls.status];
    return (
      <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${cls.status === 'live' ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'}`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{cls.subject}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{cls.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cls.time}</span>
                <span>{cls.duration}</span>
              </div>
            </div>
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
          </div>
          <div className="flex gap-2 mt-3">
            {cls.status !== 'completed' ? (
              <a href={cls.meetLink} target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors">
                <Play className="h-3.5 w-3.5" />{cls.status === 'live' ? 'Start Class' : 'Open Link'}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <a href={cls.recordingUrl || '#'} target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors">
                <Play className="h-3.5 w-3.5" />View Recording
              </a>
            )}
            <button onClick={() => deleteClass(cls.id)} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Video className="h-6 w-6 text-teal-600" />Online Classes</h1>
          <p className="text-gray-500 text-sm mt-0.5">Schedule and manage virtual classes</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />Schedule Class</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Live Now', value: live.length, color: 'text-red-600' },
          { label: 'Upcoming', value: upcoming.length, color: 'text-amber-600' },
          { label: 'Completed', value: completed.length, color: 'text-green-600' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      {live.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />Live Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{live.map(c => <ClassCard key={c.id} cls={c} />)}</div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wide mb-3">Upcoming Classes</h2>
        {upcoming.length === 0 ? <p className="text-sm text-gray-400">No upcoming classes scheduled.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{upcoming.map(c => <ClassCard key={c.id} cls={c} />)}</div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Completed & Recordings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{completed.map(c => <ClassCard key={c.id} cls={c} />)}</div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader><DialogTitle>Schedule Online Class</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject *</label>
                <Select value={form.subject} onValueChange={v => setForm(p => ({ ...p, subject: v }))} placeholder="Select Subject">
                  <SelectItem value="IOT & Embedded Systems">IOT & Embedded Systems</SelectItem>
                  <SelectItem value="Embedded C Programming">Embedded C Programming</SelectItem>
                  <SelectItem value="Network Protocols">Network Protocols</SelectItem>
                </Select>
              </div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Platform</label>
                <Select value={form.platform} onValueChange={v => setForm(p => ({ ...p, platform: v }))}>
                  <SelectItem value="google_meet">🟢 Google Meet</SelectItem>
                  <SelectItem value="zoom">🔵 Zoom</SelectItem>
                  <SelectItem value="teams">🟣 MS Teams</SelectItem>
                  <SelectItem value="custom">⚪ Custom</SelectItem>
                </Select>
              </div>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Meeting Link</label><Input placeholder="https://meet.google.com/..." value={form.meetingLink} onChange={e => setForm(p => ({ ...p, meetingLink: e.target.value }))} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Date *</label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Time *</label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Duration (min)</label><Input type="number" placeholder="60" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Schedule Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
