'use client';
import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, XCircle, Clock, MessageSquare, Send, RefreshCw } from 'lucide-react';

interface NotifLog {
  id: string;
  channel: string;
  recipient: string;
  message: string;
  status: string;
  provider: string;
  errorMessage?: string;
  sentAt: string;
}

export default function ParentNotificationsPage() {
  const [logs, setLogs] = useState<NotifLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    // Parents can only see their own notifications — backend filters by phone
    const r = await fetch('/api/v1/notification-logs?limit=50');
    if (r.ok) {
      const d = await r.json();
      setLogs(Array.isArray(d) ? d : d.data || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const statusIcon = (s: string) => {
    if (s === 'sent') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (s === 'failed') return <XCircle className="h-4 w-4 text-red-400" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl"><Bell className="h-6 w-6 text-indigo-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Notifications</h1>
            <p className="text-sm text-gray-500">SMS and WhatsApp messages sent to your number</p>
          </div>
        </div>
        <button onClick={load} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
          <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
          <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-500 font-medium">No notifications yet</h3>
          <p className="text-sm text-gray-400 mt-1">SMS and WhatsApp messages from your school will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className={`bg-white border rounded-2xl p-4 shadow-sm flex gap-3 items-start transition-all hover:shadow-md ${log.status === 'failed' ? 'border-red-100' : 'border-gray-200'}`}>
              <div className="mt-0.5">{statusIcon(log.status)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${log.channel === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {log.channel === 'whatsapp' ? '💬' : '📱'} {log.channel.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(log.sentAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{log.message}</p>
                {log.errorMessage && <p className="text-xs text-red-500 mt-1">Error: {log.errorMessage}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
