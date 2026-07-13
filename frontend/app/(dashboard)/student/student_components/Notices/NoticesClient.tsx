'use client';

import { ResourceState } from '@/lib/useResource';
import { Bell } from 'lucide-react';
import { useNotices } from '../../student_hooks/useNotices';
import '../../student.css';

const priorityConfig = {
  high:   { color: 'var(--student-danger)',  bg: 'var(--student-danger-bg)',  border: 'var(--student-danger)',  dot: 'var(--student-danger)',  label: 'High Priority' },
  medium: { color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)', dot: 'var(--student-warning)', label: 'Medium' },
  low:    { color: 'var(--student-info)',    bg: 'var(--student-info-bg)',    border: 'var(--student-info)',    dot: 'var(--student-info)',    label: 'Info' },
};

export default function NoticesClient() {
  const { notices, loading, error } = useNotices();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <Bell className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Notice Board
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Important announcements from school administration</p>
      </div>

      <div className="space-y-4">
        {notices.map((n, i) => {
          const cfg = priorityConfig[n.priority] || priorityConfig.low;
          return (
            <div key={n.id} className="rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-fade-in-up"
                 style={{ animationDelay: `${i * 60}ms`, backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: cfg.dot }} />
                <span className="text-xs font-semibold uppercase tracking-wide">{cfg.label}</span>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: cfg.border }}>
                  {n.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-bold mb-2" style={{ color: 'var(--student-text-primary)' }}>{n.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--student-text-secondary)' }}>{n.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: 'var(--student-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--student-text-disabled)' }}>📅 {new Date(n.publishedAt).toLocaleDateString()}</span>
                  <span className="text-xs" style={{ color: 'var(--student-text-disabled)' }}>✍️ {n.authorName}</span>
                </div>
              </div>
            </div>
          );
        })}
        {notices.length === 0 && (
          <div className="p-8 text-center text-sm" style={{ color: 'var(--student-text-disabled)' }}>No notices available.</div>
        )}
      </div>
    </div>
  );
}
