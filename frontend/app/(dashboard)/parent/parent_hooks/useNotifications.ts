import { useState, useEffect, useCallback } from 'react';

export interface NotifLog {
  id: string;
  channel: string;
  recipient: string;
  message: string;
  status: string;
  provider: string;
  errorMessage?: string;
  sentAt: string;
}

export function useNotifications() {
  const [logs, setLogs] = useState<NotifLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/v1/notification-logs?limit=50');
      if (r.ok) {
        const d = await r.json();
        setLogs(Array.isArray(d) ? d : d.data || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    logs,
    loading,
    load
  };
}
