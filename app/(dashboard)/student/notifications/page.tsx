'use client';
import { useState } from 'react';
import { useResource } from '@/lib/useResource';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, FileText, Award, CheckSquare, CreditCard, Briefcase, Megaphone, CheckCheck } from 'lucide-react';

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function StudentNotificationsPage() {
  const { data: notices } = useResource<{ id: string; title: string; content: string; publishedAt: string; priority: string }>('notices');
  const { data: leaves } = useResource<{ id: string; leaveType: string; status: string; createdAt: string; fromDate: string }>('leaves');
  const { data: fees } = useResource<{ id: string; title: string; dueDate: string; status: string; amount: number }>('fees');
  const { data: exams } = useResource<{ id: string; subject: string; startsAt: string }>('exams');
  const { data: assignments } = useResource<{ id: string; title: string; dueAt: string; status: string }>('assignments');

  type NotifItem = { id: string; title: string; body: string; type: string; createdAt: string; isRead: boolean };
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifs: NotifItem[] = [
    ...notices.map(n => ({ id: `ntc-${n.id}`, title: n.title, body: n.content, type: 'notice', createdAt: n.publishedAt, isRead: false })),
    ...leaves.filter(l => l.status !== 'pending').map(l => ({ id: `lv-${l.id}`, title: `Leave ${l.status}`, body: `Your ${l.leaveType} leave from ${l.fromDate} has been ${l.status}.`, type: 'leave', createdAt: l.createdAt, isRead: false })),
    ...fees.filter(f => f.status !== 'paid').map(f => ({ id: `fee-${f.id}`, title: 'Fee Due', body: `${f.title} of ₹${f.amount} is due on ${new Date(f.dueDate).toLocaleDateString()}.`, type: 'fee', createdAt: f.dueDate, isRead: false })),
    ...exams.map(e => ({ id: `ex-${e.id}`, title: 'Exam Scheduled', body: `${e.subject} exam on ${new Date(e.startsAt).toLocaleDateString()}.`, type: 'exam', createdAt: e.startsAt, isRead: false })),
    ...assignments.filter(a => a.status === 'active').map(a => ({ id: `asgn-${a.id}`, title: 'Assignment Due', body: `${a.title} is due on ${new Date(a.dueAt).toLocaleDateString()}.`, type: 'assignment', createdAt: a.dueAt, isRead: false })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    notice:     { icon: Megaphone,   color: 'text-amber-600',  bg: 'bg-amber-100',  label: 'Notice' },
    leave:      { icon: Briefcase,   color: 'text-teal-600',   bg: 'bg-teal-100',   label: 'Leave' },
    fee:        { icon: CreditCard,  color: 'text-blue-600',   bg: 'bg-blue-100',   label: 'Fee' },
    exam:       { icon: Award,       color: 'text-purple-600', bg: 'bg-purple-100', label: 'Exam' },
    assignment: { icon: FileText,    color: 'text-orange-600', bg: 'bg-orange-100', label: 'Assignment' },
    attendance: { icon: CheckSquare, color: 'text-red-600',    bg: 'bg-red-100',    label: 'Attendance' },
  };

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const unreadCount = notifs.filter(n => !readIds.has(n.id)).length;
  const displayed = filter === 'unread' ? notifs.filter(n => !readIds.has(n.id)) : notifs;

  const markRead = (id: string) => setReadIds(p => new Set([...p, id]));
  const markAllRead = () => setReadIds(new Set(notifs.map(n => n.id)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-teal-600" />Notifications
            {unreadCount > 0 && (
              <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Stay updated with all your activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-2">
            <CheckCheck className="h-4 w-4" />Mark all read
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {(['all', 'unread'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300'}`}>
            {f === 'all' ? `All (${notifs.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {displayed.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <Bell className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No notifications</p>
          </div>
        ) : displayed.map((n, i) => {
          const cfg = typeConfig[n.type] || typeConfig.notice;
          const Icon = cfg.icon;
          const isRead = readIds.has(n.id);
          return (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 animate-fade-in-up card-hover ${isRead ? 'bg-white border-gray-100' : 'bg-blue-50/60 border-blue-100 shadow-sm'}`}
              style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`relative flex-shrink-0 w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${cfg.color}`} />
                {!isRead && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] py-0">{cfg.label}</Badge>
                  {!isRead && <span className="text-[10px] text-blue-600 font-medium">• New</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
