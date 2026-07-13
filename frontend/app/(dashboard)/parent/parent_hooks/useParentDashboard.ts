import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

export interface ParentMessage {
  id: string;
  teacherId: string;
  studentName: string;
  parentName: string;
  subject: string;
  body: string;
  category: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export function useParentDashboard() {
  const { token } = useAuth();
  const [childInfo, setChildInfo] = useState<{ name: string; class?: string; section?: string; email: string; fatherName?: string; bloodGroup?: string } | null>(null);
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [notices, setNotices] = useState<Array<{ id: string; title: string; content: string; publishedAt: string; priority: string }>>([]);
  const [fees, setFees] = useState<Array<{ id: string; amount: number; status: string }>>([]);
  const [loading, setLoading] = useState(true);
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', body: '', category: 'general', priority: 'normal' });
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch('/api/v1/parent/child-info').then(r => r.ok ? r.json() : null),
      fetch('/api/v1/parent/messages').then(r => r.ok ? r.json() : []),
      fetch('/api/v1/resources/notices').then(r => r.ok ? r.json() : []),
      fetch('/api/v1/resources/fees').then(r => r.ok ? r.json() : []),
    ])
      .then(([info, msgs, ntcs, feeData]) => {
        if (info?.child) setChildInfo(info.child);
        setMessages(msgs || []);
        setNotices(ntcs || []);
        setFees(feeData || []);
      })
      .catch(err => console.error("Error fetching parent dashboard data:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.body.trim()) return;
    
    try {
      const res = await fetch('/api/v1/parent/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(p => [newMsg, ...p]);
        setForm({ subject: '', body: '', category: 'general', priority: 'normal' });
        setSendSuccess(true);
        setTimeout(() => { 
          setSendSuccess(false); 
          setIsComposeOpen(false); 
        }, 1500);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const totalDue = fees.filter(f => f.status !== 'paid').reduce((a, f) => a + f.amount, 0);
  const totalPaid = fees.filter(f => f.status === 'paid').reduce((a, f) => a + f.amount, 0);
  const initials = childInfo?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';

  return {
    childInfo,
    messages,
    notices,
    fees,
    loading,
    isComposeOpen,
    setIsComposeOpen,
    form,
    setForm,
    sendSuccess,
    handleSend,
    totalDue,
    totalPaid,
    initials
  };
}
