'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Megaphone, Plus, Trash2 } from 'lucide-react';

interface Announcement {
  id: string; title: string; content: string; category: string; createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', targetType: 'all' });

  useEffect(() => {
    fetch('/api/v1/superadmin/announcements')
      .then(r => r.ok ? r.json() : [])
      .then(setAnnouncements);
  }, []);

  const create = async () => {
    if (!form.title || !form.content) return;
    const res = await fetch('/api/v1/superadmin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const ann = await res.json();
      setAnnouncements(p => [ann, ...p]);
      setForm({ title: '', content: '', targetType: 'all' });
      setOpen(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/v1/superadmin/announcements/${id}`, { method: 'DELETE' });
    setAnnouncements(p => p.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Megaphone className="h-6 w-6 text-teal-600" />Platform Announcements</h1>
          <p className="text-gray-500 text-sm mt-0.5">Broadcast messages to all institutions</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />New Announcement</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Total', value: announcements.length, color: 'text-teal-600' },
          { label: 'This Month', value: announcements.filter(a => new Date(a.createdAt).getMonth() === new Date().getMonth()).length, color: 'text-green-600' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      <div className="space-y-3">
        {announcements.map(ann => (
          <Card key={ann.id} className="border-purple-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-900">{ann.title}</p>
                    <Badge variant="success">Active</Badge>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">{ann.category === 'all' ? 'All Institutions' : ann.category}</span>
                  </div>
                  <p className="text-sm text-gray-600">{ann.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(ann.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => remove(ann.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Megaphone className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No announcements yet</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader><DialogTitle>New Platform Announcement</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Title *</label><Input placeholder="Announcement title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Target</label>
              <Select value={form.targetType} onValueChange={v => setForm(p => ({ ...p, targetType: v }))}>
                <SelectItem value="all">All Institutions</SelectItem>
                <SelectItem value="school">Schools Only</SelectItem>
                <SelectItem value="coaching">Coaching Only</SelectItem>
                <SelectItem value="college">Colleges Only</SelectItem>
              </Select>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Content *</label><Textarea placeholder="Announcement content..." rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
