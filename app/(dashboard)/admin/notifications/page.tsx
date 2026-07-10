'use client';
import React, { useEffect, useState } from 'react';
import { Send, MessageSquare, Users, Filter, RefreshCw, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

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

const ROLE_OPTIONS = [
  { value: 'student', label: 'Students' },
  { value: 'parent', label: 'Parents' },
  { value: 'teacher', label: 'Teachers' },
];

export default function NotificationsPage() {
  const [logs, setLogs] = useState<NotifLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['parent', 'student']);
  const [message, setMessage] = useState('');
  const [filterChannel, setFilterChannel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadLogs = async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '50' });
    if (filterChannel) params.set('channel', filterChannel);
    if (filterStatus) params.set('status', filterStatus);
    const r = await fetch(`/api/v1/admin/notifications/logs?${params}`);
    if (r.ok) { const d = await r.json(); setLogs(d.data); setTotal(d.total); }
    setLoading(false);
  };

  useEffect(() => { loadLogs(); }, [filterChannel, filterStatus]);

  const handleSend = async () => {
    if (!message.trim() || message.trim().length < 5) { showToast('error', 'Message must be at least 5 characters'); return; }
    if (selectedRoles.length === 0) { showToast('error', 'Select at least one recipient group'); return; }
    setSendLoading(true);
    try {
      const r = await fetch('/api/v1/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, roles: selectedRoles, message }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || data.error);
      showToast('success', `Sent: ${data.sent ?? 'OK'} | Failed: ${data.failed ?? 0}`);
      setMessage('');
      await loadLogs();
    } catch (e: any) { showToast('error', e.message); }
    finally { setSendLoading(false); }
  };

  const statusIcon = (s: string) => {
    if (s === 'sent') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (s === 'failed') return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl text-white font-medium animate-fade-in ${toast.type === 'success' ? 'bg-teal-600' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center gap-3 animate-fade-in">
        <div className="p-2 bg-teal-100 rounded-xl"><Send className="h-6 w-6 text-teal-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">Send SMS/WhatsApp to your institution's students, parents, and teachers</p>
        </div>
      </div>

      {/* Compose Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-teal-600" />Compose & Send</h2>

        {/* Channel */}
        <div className="flex gap-2 mb-4">
          {(['sms', 'whatsapp'] as const).map(c => (
            <button key={c} onClick={() => setChannel(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${channel === c ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {c === 'sms' ? '📱 SMS' : '💬 WhatsApp'}
            </button>
          ))}
        </div>

        {/* Recipient groups */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1"><Users className="h-3 w-3" />Send To</label>
          <div className="flex gap-2 flex-wrap">
            {ROLE_OPTIONS.map(r => (
              <button key={r.value} onClick={() => setSelectedRoles(p => p.includes(r.value) ? p.filter(x => x !== r.value) : [...p, r.value])}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${selectedRoles.includes(r.value) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-2">Message</label>
          <textarea
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message here... (e.g. 'Dear Parent, school will remain closed on 15th July due to annual sports day.')"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">{message.length} chars</span>
            {channel === 'sms' && message.length > 160 && (
              <span className="text-xs text-amber-600">⚠️ SMS will split into {Math.ceil(message.length / 160)} parts</span>
            )}
          </div>
        </div>

        <button onClick={handleSend} disabled={sendLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all disabled:opacity-50">
          {sendLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sendLoading ? 'Sending...' : `Send ${channel.toUpperCase()} to ${selectedRoles.length} group(s)`}
        </button>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Delivery Logs <span className="text-gray-400 font-normal text-sm">({total} total)</span></h2>
          <div className="flex gap-2">
            <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
              className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-teal-500">
              <option value="">All Channels</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-teal-500">
              <option value="">All Status</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
            <button onClick={loadLogs} className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Send className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No notification logs yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                {statusIcon(log.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-gray-700">{log.recipient}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${log.channel === 'sms' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{log.channel}</span>
                    <span className="text-xs text-gray-400">via {log.provider}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{log.message}</p>
                  {log.errorMessage && <p className="text-xs text-red-500 mt-0.5">{log.errorMessage}</p>}
                </div>
                <span className="text-xs text-gray-400 shrink-0">{new Date(log.sentAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
