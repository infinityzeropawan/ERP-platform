'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, CreditCard, Bell, AlertTriangle, GraduationCap, MessageSquare, Send, Plus } from 'lucide-react';

interface ParentMessage {
  id: string; teacherId: string; studentName: string; parentName: string;
  subject: string; body: string; category: string; priority: string;
  isRead: boolean; createdAt: string;
}

export default function ParentDashboardPage() {
  const { token } = useAuth();
  const [childInfo, setChildInfo] = useState<{ name: string; class?: string; section?: string; email: string; fatherName?: string; bloodGroup?: string } | null>(null);
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [notices, setNotices] = useState<Array<{ id: string; title: string; content: string; publishedAt: string; priority: string }>>([]);
  const [fees, setFees] = useState<Array<{ id: string; amount: number; status: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', body: '', category: 'general', priority: 'normal' });
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch('/api/v1/parent/child-info').then(r => r.ok ? r.json() : null),
      fetch('/api/v1/parent/messages').then(r => r.ok ? r.json() : []),
      fetch('/api/v1/resources/notices').then(r => r.ok ? r.json() : []),
      fetch('/api/v1/resources/fees').then(r => r.ok ? r.json() : []),
    ]).then(([info, msgs, ntcs, feeData]) => {
      if (info?.child) setChildInfo(info.child);
      setMessages(msgs);
      setNotices(ntcs);
      setFees(feeData);
    }).finally(() => setLoading(false));
  }, [token]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.body.trim()) return;
    const res = await fetch('/api/v1/parent/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newMsg = await res.json();
      setMessages(p => [newMsg, ...p]);
      setForm({ subject: '', body: '', category: 'general', priority: 'normal' });
      setSendSuccess(true);
      setTimeout(() => { setSendSuccess(false); setIsComposeOpen(false); }, 1500);
    }
  };

  const totalDue = fees.filter(f => f.status !== 'paid').reduce((a, f) => a + f.amount, 0);
  const totalPaid = fees.filter(f => f.status === 'paid').reduce((a, f) => a + f.amount, 0);
  const initials = childInfo?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><GraduationCap className="h-6 w-6 text-teal-600" />Parent Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Monitor academic progress and connect with instructors</p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />Message School</Button>
      </div>

      {childInfo && (
        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl animate-fade-in-up">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border-2 border-white/30">{initials}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{childInfo.name}</h2>
              <p className="text-white/80 text-sm">{childInfo.class || 'No Class'} · {childInfo.section || 'No Section'} · {childInfo.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {childInfo.fatherName && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Father: {childInfo.fatherName}</span>}
                {childInfo.bloodGroup && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Blood: {childInfo.bloodGroup}</span>}
                <span className="px-3 py-1 bg-green-400/30 rounded-full text-xs font-medium">✓ Registered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {totalDue > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start justify-between gap-3 animate-slide-right">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-700">Fee Due</p>
              <p className="text-xs text-amber-600 mt-0.5">₹{totalDue.toLocaleString()} is pending. Please clear dues to avoid late fees.</p>
            </div>
          </div>
          <Link href="/parent/pay">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-medium hover:bg-amber-600 transition-all shrink-0">
              <CreditCard className="h-3.5 w-3.5" />Pay Online
            </button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Fee Paid', value: `₹${totalPaid.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, href: '/parent/pay' },
          { label: 'Fee Due', value: `₹${totalDue.toLocaleString()}`, color: totalDue > 0 ? 'text-red-600' : 'text-gray-400', bg: totalDue > 0 ? 'bg-red-50' : 'bg-gray-50', border: totalDue > 0 ? 'border-red-200' : 'border-gray-200', icon: CreditCard, href: '/parent/pay' },
          { label: 'Messages', value: String(messages.length), color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', icon: MessageSquare, href: null },
          { label: 'Notifications', value: 'View', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: Bell, href: '/parent/notifications' },
        ].map((s, i) => (
          <Link key={s.label} href={s.href ?? '#'}>
            <div className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up cursor-pointer`} style={{ animationDelay: `${i * 80}ms` }}>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-teal-600" /><h3 className="text-sm font-semibold text-gray-800">Messages & Alerts</h3></div>
            <Badge className="bg-teal-50 text-teal-700 border-teal-200">{messages.length}</Badge>
          </div>
          <div className="divide-y divide-gray-50 max-h-[350px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No messages yet.</div>
            ) : messages.map(m => (
              <div key={m.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase ${m.priority === 'urgent' ? 'text-red-700 bg-red-50 border-red-200' : m.priority === 'important' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-teal-700 bg-teal-50 border-teal-200'}`}>{m.priority}</span>
                  <span className="text-[10px] text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mt-1.5">{m.subject}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{m.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
            <Bell className="h-4 w-4 text-teal-600" /><h3 className="text-sm font-semibold text-gray-800">School Notices</h3>
          </div>
          <div className="p-5 space-y-3">
            {notices.slice(0, 3).map(n => (
              <div key={n.id} className={`p-3 rounded-xl border ${n.priority === 'high' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.content}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.publishedAt).toLocaleDateString()}</p>
              </div>
            ))}
            {notices.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No notices yet.</p>}
          </div>
        </div>
      </div>

      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader><DialogTitle>Message School</DialogTitle></DialogHeader>
          <form onSubmit={handleSend} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-gray-600">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full mt-1 h-10 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50">
                <option value="general">General Inquiry</option>
                <option value="attendance">Attendance / Leave</option>
                <option value="academic">Academic Progress</option>
                <option value="fee">Fees / Payments</option>
              </select>
            </div>
            <div><label className="text-xs font-semibold text-gray-600">Subject</label><Input required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Brief title" className="mt-1" /></div>
            <div><label className="text-xs font-semibold text-gray-600">Message</label><Textarea required value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Type details here..." rows={4} className="mt-1" /></div>
            {sendSuccess && <p className="text-xs text-green-600 font-medium text-center">✓ Message sent successfully!</p>}
            <DialogFooter>
              <Button type="submit" className="w-full flex items-center gap-2"><Send className="h-4 w-4" />Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
