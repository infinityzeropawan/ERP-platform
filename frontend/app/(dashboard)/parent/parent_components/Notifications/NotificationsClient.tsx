'use client';

import React from 'react';
import { Bell, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useNotifications } from '../../parent_hooks/useNotifications';
import '../../parent.css';

export default function NotificationsClient() {
  const { logs, loading, load } = useNotifications();

  const statusIcon = (s: string) => {
    if (s === 'sent') return <CheckCircle className="h-4 w-4" style={{ color: 'var(--parent-success)' }} />;
    if (s === 'failed') return <XCircle className="h-4 w-4" style={{ color: 'var(--parent-danger)' }} />;
    return <Clock className="h-4 w-4" style={{ color: 'var(--parent-warning)' }} />;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--parent-primary-subtle)' }}>
            <Bell className="h-6 w-6" style={{ color: 'var(--parent-primary)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--parent-text-primary)' }}>My Notifications</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--parent-text-secondary)' }}>SMS and WhatsApp messages sent to your number</p>
          </div>
        </div>
        <button onClick={load} className="p-2 rounded-xl transition-all shadow-sm hover:shadow-md"
                style={{ backgroundColor: 'var(--parent-bg-card)', borderColor: 'var(--parent-border)', borderWidth: '1px' }}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--parent-text-secondary)' }} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--parent-primary)' }} />
        </div>
      ) : logs.length === 0 ? (
        <div className="border rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--parent-bg-card)', borderColor: 'var(--parent-border)' }}>
          <Bell className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--parent-text-disabled)' }} />
          <h3 className="font-medium" style={{ color: 'var(--parent-text-secondary)' }}>No notifications yet</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--parent-text-disabled)' }}>SMS and WhatsApp messages from your school will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log, index) => (
            <div key={log.id} 
                 className="border rounded-2xl p-4 shadow-sm flex gap-3 items-start transition-all hover:shadow-md animate-fade-in-up" 
                 style={{ 
                   backgroundColor: 'var(--parent-bg-card)', 
                   borderColor: log.status === 'failed' ? 'var(--parent-danger)' : 'var(--parent-border)',
                   animationDelay: `${index * 50}ms`
                 }}>
              <div className="mt-0.5">{statusIcon(log.status)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" 
                        style={{ 
                          backgroundColor: log.channel === 'whatsapp' ? 'var(--parent-success-bg)' : 'var(--parent-info-bg)', 
                          color: log.channel === 'whatsapp' ? 'var(--parent-success)' : 'var(--parent-info)' 
                        }}>
                    {log.channel === 'whatsapp' ? '💬' : '📱'} {log.channel}
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--parent-text-disabled)' }}>
                    {new Date(log.sentAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--parent-text-primary)' }}>{log.message}</p>
                {log.errorMessage && (
                  <p className="text-xs font-medium mt-1.5" style={{ color: 'var(--parent-danger)' }}>
                    Error: {log.errorMessage}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
