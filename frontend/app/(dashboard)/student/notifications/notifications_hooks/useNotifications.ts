import { useState } from 'react';
import { useResource } from '@/lib/useResource';

export type NotifItem = {
  id: string;
  title: string;
  body: string;
  type: string;
  createdAt: string;
  isRead: boolean;
};

export function useNotifications() {
  const { data: notices, loading: loadingNotices } = useResource<{ id: string; title: string; content: string; publishedAt: string }>('notices');
  const { data: leaves, loading: loadingLeaves } = useResource<{ id: string; leaveType: string; status: string; createdAt: string; fromDate: string }>('leaves');
  const { data: fees, loading: loadingFees } = useResource<{ id: string; title: string; dueDate: string; status: string; amount: number }>('fees');
  const { data: exams, loading: loadingExams } = useResource<{ id: string; subject: string; startsAt: string }>('exams');
  const { data: assignments, loading: loadingAsgn } = useResource<{ id: string; title: string; dueAt: string; status: string }>('assignments');

  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loading = loadingNotices || loadingLeaves || loadingFees || loadingExams || loadingAsgn;

  const notifs: NotifItem[] = [
    ...notices.map(n => ({ id: `ntc-${n.id}`, title: n.title, body: n.content, type: 'notice', createdAt: n.publishedAt, isRead: false })),
    ...leaves.filter(l => l.status !== 'pending').map(l => ({ id: `lv-${l.id}`, title: `Leave ${l.status}`, body: `Your ${l.leaveType} leave from ${l.fromDate} has been ${l.status}.`, type: 'leave', createdAt: l.createdAt, isRead: false })),
    ...fees.filter(f => f.status !== 'paid').map(f => ({ id: `fee-${f.id}`, title: 'Fee Due', body: `${f.title} of ₹${f.amount} is due on ${new Date(f.dueDate).toLocaleDateString()}.`, type: 'fee', createdAt: f.dueDate, isRead: false })),
    ...exams.map(e => ({ id: `ex-${e.id}`, title: 'Exam Scheduled', body: `${e.subject} exam on ${new Date(e.startsAt).toLocaleDateString()}.`, type: 'exam', createdAt: e.startsAt, isRead: false })),
    ...assignments.filter(a => a.status === 'active').map(a => ({ id: `asgn-${a.id}`, title: 'Assignment Due', body: `${a.title} is due on ${new Date(a.dueAt).toLocaleDateString()}.`, type: 'assignment', createdAt: a.dueAt, isRead: false })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = notifs.filter(n => !readIds.has(n.id)).length;
  const displayed = filter === 'unread' ? notifs.filter(n => !readIds.has(n.id)) : notifs;

  const markRead = (id: string) => setReadIds(p => new Set([...p, id]));
  const markAllRead = () => setReadIds(new Set(notifs.map(n => n.id)));

  const timeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return {
    notifs,
    displayed,
    unreadCount,
    filter,
    setFilter,
    markRead,
    markAllRead,
    timeAgo,
    loading
  };
}
