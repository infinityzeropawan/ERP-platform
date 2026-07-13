'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, FileText, Award, CheckSquare, CreditCard, Briefcase, Megaphone, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../student_hooks/useNotifications';
import '../../student.css';

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  notice:     { icon: Megaphone,   color: 'var(--student-warning)',  bg: 'var(--student-warning-bg)',  label: 'Notice' },
  leave:      { icon: Briefcase,   color: 'var(--student-primary)',  bg: 'var(--student-primary-subtle)',  label: 'Leave' },
  fee:        { icon: CreditCard,  color: 'var(--student-info)',     bg: 'var(--student-info-bg)',     label: 'Fee' },
  exam:       { icon: Award,       color: 'var(--student-danger)',   bg: 'var(--student-danger-bg)',   label: 'Exam' },
  assignment: { icon: FileText,    color: 'var(--student-success)',  bg: 'var(--student-success-bg)',  label: 'Assignment' },
  attendance: { icon: CheckSquare, color: 'var(--student-danger)',   bg: 'var(--student-danger-bg)',   label: 'Attendance' },
};

export default function NotificationsClient() {
  const { notifs, displayed, unreadCount, filter, setFilter, markRead, markAllRead, timeAgo, loading } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <Bell className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Notifications
            {unreadCount > 0 && (
              <span className="w-6 h-6 text-white text-xs font-bold rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--student-danger)' }}>{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Stay updated with all your activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-2" style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}>
            <CheckCheck className="h-4 w-4" />Mark all read
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {(['all', 'unread'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all`}
            style={{
              backgroundColor: filter === f ? 'var(--student-primary)' : 'var(--student-bg-card)',
              color: filter === f ? 'white' : 'var(--student-text-secondary)',
              border: filter === f ? 'none' : '1px solid var(--student-border)'
            }}>
            {f === 'all' ? `All (${notifs.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="p-16 text-center text-sm" style={{ color: 'var(--student-text-disabled)' }}>Loading notifications...</div>
        ) : displayed.length === 0 ? (
          <div className="rounded-2xl border p-16 text-center" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" style={{ color: 'var(--student-text-disabled)' }} />
            <p className="font-medium" style={{ color: 'var(--student-text-disabled)' }}>No notifications</p>
          </div>
        ) : displayed.map((n, i) => {
          const cfg = typeConfig[n.type] || typeConfig.notice;
          const Icon = cfg.icon;
          const isRead = !notifs.find(nx => nx.id === n.id)?.isRead; // using our hook state mapping
          return (
            <div key={n.id} onClick={() => markRead(n.id)}
              className="group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 animate-fade-in-up card-hover"
              style={{
                animationDelay: `${i * 50}ms`,
                backgroundColor: isRead ? 'var(--student-bg-card)' : 'var(--student-info-bg)',
                borderColor: isRead ? 'var(--student-border)' : 'var(--student-info)'
              }}>
              <div className="relative flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                <Icon className="h-5 w-5" style={{ color: cfg.color }} />
                {!isRead && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: 'var(--student-info)' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold" style={{ color: isRead ? 'var(--student-text-secondary)' : 'var(--student-text-primary)' }}>{n.title}</p>
                  <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: 'var(--student-text-disabled)' }}>{timeAgo(n.createdAt)}</span>
                </div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--student-text-secondary)' }}>{n.body}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] py-0" style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-secondary)' }}>{cfg.label}</Badge>
                  {!isRead && <span className="text-[10px] font-medium" style={{ color: 'var(--student-info)' }}>• New</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
