'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResourceState, useResource } from '@/lib/useResource';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function AdminNoticesPage() {
  const { data: notices, loading, error, create: createNotice, remove } = useResource<{
    id: string; title: string; content: string; publishedAt: string; authorName: string;
  }>('notices');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });

  const create = async () => {
    if (!form.title) return;
    await createNotice({
      ...form, authorId: 'admin', authorName: 'Admin',
      priority: 'medium', category: 'General', audience: 'all',
    });
    setForm({ title: '', content: '' });
    setOpen(false);
  };
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Bell className="h-6 w-6 text-teal-600" />Notice Board</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage announcements for students and teachers</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />Post Notice</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notices.map(n => (
          <Card key={n.id} className="border-amber-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{n.title}</h3>
                <button onClick={() => void remove(n.id)} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{n.content}</p>
              <p className="text-xs text-gray-400">{new Date(n.publishedAt).toLocaleDateString()} · {n.authorName}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Post New Notice</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Title</label><Input placeholder="Notice title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Content</label><Textarea placeholder="Notice content..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create}>Post Notice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
