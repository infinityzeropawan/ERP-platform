'use client';
import { ResourceState, useResource } from '@/lib/useResource';
import { Bell, AlertCircle, Info, Tag } from 'lucide-react';

const priorityConfig = {
  high: { color: 'text-red-700 bg-red-50 border-red-200', dot: 'bg-red-500', label: 'High Priority' },
  medium: { color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500', label: 'Medium' },
  low: { color: 'text-blue-700 bg-blue-50 border-blue-200', dot: 'bg-blue-400', label: 'Info' },
};

export default function StudentNoticesPage() {
  const { data: notices, loading, error } = useResource<{
    id: string; title: string; content: string; publishedAt: string;
    authorName: string; priority: 'high' | 'medium' | 'low'; category: string;
  }>('notices');
  const state = <ResourceState loading={loading} error={error} />;
  if (loading || error) return state;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Bell className="h-6 w-6 text-teal-600" />Notice Board</h1>
        <p className="text-gray-500 text-sm mt-0.5">Important announcements from school administration</p>
      </div>

      <div className="space-y-4">
        {notices.map(n => {
          const cfg = priorityConfig[n.priority];
          return (
            <div key={n.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow`}>
              <div className={`flex items-center gap-3 px-5 py-3 border-b ${cfg.color}`}>
                <div className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                <span className="text-xs font-semibold uppercase tracking-wide">{cfg.label}</span>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 bg-white/60 rounded-full border">{n.category}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{n.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{n.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400">📅 {new Date(n.publishedAt).toLocaleDateString()}</span>
                  <span className="text-xs text-gray-400">✍️ {n.authorName}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
