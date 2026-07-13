'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Search, Mail, Users } from 'lucide-react';

interface Message {
  id: string; studentName: string; parentName: string; subject: string;
  body: string; category: string; priority: string; createdAt: string; isRead: boolean;
}

export default function MessagingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<Array<{ id: string; name: string; fatherName?: string }>>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [search, setSearch] = useState('');
  const [compose, setCompose] = useState(false);
  const [form, setForm] = useState({ studentId: '', parentName: '', subject: '', body: '', category: 'general', priority: 'normal' });

  useEffect(() => {
    fetch('/api/v1/teacher/parent-messages').then(r => r.ok ? r.json() : []).then(setMessages);
    fetch('/api/v1/teacher/students').then(r => r.ok ? r.json() : []).then(setStudents);
  }, []);

  const filtered = messages.filter(m =>
    m.studentName.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const send = async () => {
    if (!form.studentId || !form.subject || !form.body) return;
    const student = students.find(s => s.id === form.studentId);
    const res = await fetch('/api/v1/teacher/parent-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, parentName: form.parentName || student?.fatherName || 'Parent' }),
    });
    if (res.ok) {
      const newMsg = await res.json();
      setMessages(p => [{ ...newMsg, studentName: student?.name || '' }, ...p]);
      setCompose(false);
      setForm({ studentId: '', parentName: '', subject: '', body: '', category: 'general', priority: 'normal' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MessageCircle className="h-6 w-6 text-teal-600" />Parent Communication</h1>
          <p className="text-gray-500 text-sm mt-0.5">Send messages and alerts to parents</p>
        </div>
        <Button onClick={() => setCompose(true)} className="flex items-center gap-2"><Send className="h-4 w-4" />New Message</Button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Message List */}
        <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative"><Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map(m => (
              <button key={m.id} onClick={() => setSelected(m)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selected?.id === m.id ? 'bg-teal-50 border-l-2 border-l-teal-500' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{m.studentName}</p>
                  <span className="text-[10px] text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{m.subject}</p>
                <Badge variant="outline" className="mt-1 text-[10px] py-0 capitalize">{m.category}</Badge>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
                <Mail className="h-8 w-8 text-gray-300" />
                <p className="text-sm">No messages yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail / Compose */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
          {compose ? (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <h3 className="font-semibold text-gray-900">New Message to Parent</h3>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Student *</label>
                <select value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Parent Name</label>
                <Input placeholder="Parent name" value={form.parentName} onChange={e => setForm(p => ({ ...p, parentName: e.target.value }))} />
              </div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject *</label>
                <Input placeholder="Message subject" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
              </div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Message *</label>
                <Textarea placeholder="Write your message..." rows={5} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCompose(false)}>Cancel</Button>
                <Button onClick={send} disabled={!form.studentId || !form.subject || !form.body} className="flex items-center gap-2">
                  <Send className="h-4 w-4" />Send Message
                </Button>
              </div>
            </div>
          ) : selected ? (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">{selected.subject}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />To: {selected.parentName} (Parent of {selected.studentName})</span>
                  <span>{new Date(selected.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">{selected.category}</Badge>
                  <Badge variant={selected.priority === 'urgent' ? 'danger' : selected.priority === 'important' ? 'warning' : 'default'} className="capitalize">{selected.priority}</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageCircle className="h-12 w-12 text-gray-200 mb-3" />
              <p className="font-medium">Select a message or compose new</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
