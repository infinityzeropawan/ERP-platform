'use client';

import { MessageCircle, Mail } from 'lucide-react';
import { useMessaging } from @/app/(dashboard)/student/messaging/messaging_hooks/useMessaging;
import '../../student.css';

export default function MessagingClient() {
  const { messages, selected, setSelected, loading } = useMessaging();

  return (
    <div className="space-y-4">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <MessageCircle className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Messages
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>School notices and communications</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        <div className="w-80 flex-shrink-0 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-page)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--student-text-secondary)' }}>Inbox ({messages.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: 'var(--student-border)' }}>
            {loading ? (
               <div className="p-4 text-center text-sm" style={{ color: 'var(--student-text-disabled)' }}>Loading messages...</div>
            ) : (
              messages.map(m => (
                <button key={m.id} onClick={() => setSelected(m)}
                  className={`w-full text-left px-4 py-3 transition-colors ${selected?.id === m.id ? 'border-l-2' : ''}`}
                  style={{
                    backgroundColor: selected?.id === m.id ? 'var(--student-primary-subtle)' : 'transparent',
                    borderLeftColor: selected?.id === m.id ? 'var(--student-primary)' : 'transparent'
                  }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--student-text-primary)' }}>{m.subject}</p>
                    <span className="text-[10px]" style={{ color: 'var(--student-text-disabled)' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--student-text-secondary)' }}>{m.body}</p>
                </button>
              ))
            )}
            {!loading && messages.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12" style={{ color: 'var(--student-text-disabled)' }}>
                <Mail className="h-8 w-8 opacity-50" /><p className="text-sm">No messages</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          {selected ? (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--student-border)' }}>
                <h3 className="font-bold text-lg" style={{ color: 'var(--student-text-primary)' }}>{selected.subject}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm" style={{ color: 'var(--student-text-secondary)' }}>
                  <span>From: {selected.teacherId}</span>
                  <span>{new Date(selected.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--student-text-primary)' }}>{selected.body}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center" style={{ color: 'var(--student-text-disabled)' }}>
              <MessageCircle className="h-12 w-12 mb-3 opacity-20" />
              <p className="font-medium">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
