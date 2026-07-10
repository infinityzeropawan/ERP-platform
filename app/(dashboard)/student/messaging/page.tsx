'use client';
import { useEffect, useState } from 'react';
import { MessageCircle, Mail } from 'lucide-react';

interface Message {
  id: string; subject: string; body: string; teacherId: string;
  category: string; priority: string; createdAt: string; isRead: boolean;
}

export default function StudentMessagingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    // Students see messages sent to their parent from teachers
    fetch('/api/v1/resources/notices')
      .then(r => r.ok ? r.json() : [])
      .then((notices: Array<{ id: string; title: string; content: string; publishedAt: string; authorName: string }>) => {
        setMessages(notices.map(n => ({
          id: n.id, subject: n.title, body: n.content,
          teacherId: n.authorName, category: 'notice', priority: 'normal',
          createdAt: n.publishedAt, isRead: false,
        })));
      });
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MessageCircle className="h-6 w-6 text-teal-600" />Messages</h1>
        <p className="text-gray-500 text-sm mt-0.5">School notices and communications</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inbox ({messages.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {messages.map(m => (
              <button key={m.id} onClick={() => setSelected(m)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selected?.id === m.id ? 'bg-teal-50 border-l-2 border-l-teal-500' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{m.subject}</p>
                  <span className="text-[10px] text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{m.body}</p>
              </button>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
                <Mail className="h-8 w-8 text-gray-300" /><p className="text-sm">No messages</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
          {selected ? (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">{selected.subject}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                  <span>From: {selected.teacherId}</span>
                  <span>{new Date(selected.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageCircle className="h-12 w-12 text-gray-200 mb-3" />
              <p className="font-medium">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
