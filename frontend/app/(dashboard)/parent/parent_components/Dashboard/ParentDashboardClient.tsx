'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, CreditCard, Bell, AlertTriangle, GraduationCap, MessageSquare, Send, Plus } from 'lucide-react';
import { useParentDashboard } from '../../parent_hooks/useParentDashboard';
import '../../parent.css';

export default function ParentDashboardClient() {
  const {
    childInfo,
    messages,
    notices,
    loading,
    isComposeOpen,
    setIsComposeOpen,
    form,
    setForm,
    sendSuccess,
    handleSend,
    totalDue,
    totalPaid,
    initials
  } = useParentDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--parent-primary)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center animate-fade-in flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--parent-text-primary)' }}>
            <GraduationCap className="h-6 w-6" style={{ color: 'var(--parent-primary)' }} />Parent Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--parent-text-secondary)' }}>Monitor academic progress and connect with instructors</p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)} className="flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
                style={{ backgroundColor: 'var(--parent-primary)', color: 'white' }}>
          <Plus className="h-4 w-4" />Message School
        </Button>
      </div>

      {childInfo && (
        <div className="rounded-2xl p-6 text-white shadow-lg animate-fade-in-up"
             style={{ background: 'linear-gradient(135deg, var(--parent-primary) 0%, #10B981 100%)' }}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30 shadow-inner flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{childInfo.name}</h2>
              <p className="text-white/80 text-sm font-medium">{childInfo.class || 'No Class'} · {childInfo.section || 'No Section'} · {childInfo.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {childInfo.fatherName && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm">Father: {childInfo.fatherName}</span>}
                {childInfo.bloodGroup && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm">Blood: {childInfo.bloodGroup}</span>}
                <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm" style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}>✓ Registered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {totalDue > 0 && (
        <div className="border rounded-2xl p-5 flex items-start justify-between gap-4 animate-slide-right shadow-sm"
             style={{ backgroundColor: 'var(--parent-warning-bg)', borderColor: 'var(--parent-warning)' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" style={{ color: 'var(--parent-warning)' }} />
            <div>
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--parent-warning)' }}>Fee Due</p>
              <p className="text-sm font-medium mt-1 leading-relaxed" style={{ color: 'var(--parent-text-primary)' }}>
                ₹{totalDue.toLocaleString()} is pending. Please clear dues to avoid late fees.
              </p>
            </div>
          </div>
          <Link href="/parent/pay">
            <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-transform hover:scale-105 shadow-md shrink-0"
                    style={{ backgroundColor: 'var(--parent-warning)' }}>
              <CreditCard className="h-4 w-4" />Pay Online
            </button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Fee Paid', value: `₹${totalPaid.toLocaleString()}`, color: 'var(--parent-success)', bg: 'var(--parent-success-bg)', border: 'var(--parent-success)', icon: CheckCircle, href: '/parent/pay' },
          { label: 'Fee Due', value: `₹${totalDue.toLocaleString()}`, color: totalDue > 0 ? 'var(--parent-danger)' : 'var(--parent-text-disabled)', bg: totalDue > 0 ? 'var(--parent-danger-bg)' : 'var(--parent-bg-card)', border: totalDue > 0 ? 'var(--parent-danger)' : 'var(--parent-border)', icon: CreditCard, href: '/parent/pay' },
          { label: 'Messages', value: String(messages.length), color: 'var(--parent-primary)', bg: 'var(--parent-primary-subtle)', border: 'var(--parent-primary)', icon: MessageSquare, href: '#' },
          { label: 'Notifications', value: 'View', color: 'var(--parent-info)', bg: 'var(--parent-info-bg)', border: 'var(--parent-info)', icon: Bell, href: '/parent/notifications' },
        ].map((s, i) => (
          <Link key={s.label} href={s.href ?? '#'}>
            <div className="rounded-2xl p-4 transition-all hover:shadow-md animate-fade-in-up border cursor-pointer group h-full" 
                 style={{ backgroundColor: s.bg, borderColor: s.border, animationDelay: `${i * 80}ms` }}>
              <p className="text-xs font-bold uppercase tracking-wide opacity-80" style={{ color: s.color }}>{s.label}</p>
              <div className="flex justify-between items-end mt-2">
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <s.icon className="h-6 w-6 opacity-30 transition-opacity group-hover:opacity-80" style={{ color: s.color }} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up flex flex-col max-h-[450px]" style={{ backgroundColor: 'var(--parent-bg-card)', borderColor: 'var(--parent-border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--parent-border)', backgroundColor: 'var(--parent-bg-hover)' }}>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" style={{ color: 'var(--parent-primary)' }} />
              <h3 className="text-base font-bold" style={{ color: 'var(--parent-text-primary)' }}>Messages & Alerts</h3>
            </div>
            <Badge style={{ backgroundColor: 'var(--parent-primary-subtle)', color: 'var(--parent-primary)', border: '1px solid var(--parent-primary)' }}>{messages.length}</Badge>
          </div>
          <div className="divide-y overflow-y-auto flex-1" style={{ borderColor: 'var(--parent-border)' }}>
            {messages.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold" style={{ color: 'var(--parent-text-disabled)' }}>No messages yet.</div>
            ) : messages.map(m => (
              <div key={m.id} className="p-5 transition-colors hover:bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider" 
                        style={{ 
                          color: m.priority === 'urgent' ? 'var(--parent-danger)' : m.priority === 'important' ? 'var(--parent-warning)' : 'var(--parent-primary)',
                          backgroundColor: m.priority === 'urgent' ? 'var(--parent-danger-bg)' : m.priority === 'important' ? 'var(--parent-warning-bg)' : 'var(--parent-primary-subtle)',
                          borderColor: m.priority === 'urgent' ? 'var(--parent-danger)' : m.priority === 'important' ? 'var(--parent-warning)' : 'var(--parent-primary)'
                        }}>
                    {m.priority}
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--parent-text-disabled)' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-bold leading-snug" style={{ color: 'var(--parent-text-primary)' }}>{m.subject}</h4>
                <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--parent-text-secondary)' }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up flex flex-col max-h-[450px]" style={{ backgroundColor: 'var(--parent-bg-card)', borderColor: 'var(--parent-border)' }}>
          <div className="flex items-center gap-2 px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--parent-border)', backgroundColor: 'var(--parent-bg-hover)' }}>
            <Bell className="h-5 w-5" style={{ color: 'var(--parent-info)' }} />
            <h3 className="text-base font-bold" style={{ color: 'var(--parent-text-primary)' }}>School Notices</h3>
          </div>
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {notices.slice(0, 3).map(n => (
              <div key={n.id} className="p-4 rounded-xl border transition-colors hover:shadow-md" 
                   style={{ 
                     backgroundColor: n.priority === 'high' ? 'var(--parent-danger-bg)' : 'var(--parent-bg-card)', 
                     borderColor: n.priority === 'high' ? 'var(--parent-danger)' : 'var(--parent-border)' 
                   }}>
                <p className="text-sm font-bold leading-snug" style={{ color: 'var(--parent-text-primary)' }}>{n.title}</p>
                <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--parent-text-secondary)' }}>{n.content}</p>
                <p className="text-[10px] font-medium mt-2" style={{ color: 'var(--parent-text-disabled)' }}>{new Date(n.publishedAt).toLocaleDateString()}</p>
              </div>
            ))}
            {notices.length === 0 && <p className="text-sm text-center py-6 font-semibold" style={{ color: 'var(--parent-text-disabled)' }}>No notices yet.</p>}
          </div>
        </div>
      </div>

      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl" style={{ backgroundColor: 'var(--parent-bg-page)', borderColor: 'var(--parent-border)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--parent-text-primary)' }}>Message School</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSend} className="space-y-5 py-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--parent-text-secondary)' }}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} 
                      className="w-full h-11 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-shadow"
                      style={{ backgroundColor: 'var(--parent-bg-input)', borderColor: 'var(--parent-border)', color: 'var(--parent-text-primary)' }}>
                <option value="general">General Inquiry</option>
                <option value="attendance">Attendance / Leave</option>
                <option value="academic">Academic Progress</option>
                <option value="fee">Fees / Payments</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--parent-text-secondary)' }}>Subject</label>
              <Input required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} 
                     placeholder="Brief title" 
                     className="h-11 rounded-xl"
                     style={{ backgroundColor: 'var(--parent-bg-input)', borderColor: 'var(--parent-border)', color: 'var(--parent-text-primary)' }} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--parent-text-secondary)' }}>Message</label>
              <Textarea required value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} 
                        placeholder="Type details here..." rows={5} 
                        className="rounded-xl resize-none"
                        style={{ backgroundColor: 'var(--parent-bg-input)', borderColor: 'var(--parent-border)', color: 'var(--parent-text-primary)' }} />
            </div>
            {sendSuccess && <p className="text-xs font-bold text-center animate-fade-in" style={{ color: 'var(--parent-success)' }}>✓ Message sent successfully!</p>}
            <DialogFooter>
              <Button type="submit" className="w-full h-11 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md"
                      style={{ backgroundColor: 'var(--parent-primary)', color: 'white' }}>
                <Send className="h-4 w-4" />Send Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
