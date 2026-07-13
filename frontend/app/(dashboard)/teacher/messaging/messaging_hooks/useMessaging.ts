import { useState, useEffect } from 'react';
import { Message, Student, ComposeForm } from '../messaging_types';

export function useMessaging() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [search, setSearch] = useState('');
  const [compose, setCompose] = useState(false);
  const [form, setForm] = useState<ComposeForm>({ studentId: '', parentName: '', subject: '', body: '', category: 'general', priority: 'normal' });

  useEffect(() => {
    // In a real app, these would be API calls
    fetch('/api/v1/teacher/parent-messages').then(r => r.ok ? r.json() : []).then(setMessages).catch(() => {});
    fetch('/api/v1/teacher/students').then(r => r.ok ? r.json() : []).then(setStudents).catch(() => {});
  }, []);

  const filtered = messages.filter(m =>
    m.studentName.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const send = async () => {
    if (!form.studentId || !form.subject || !form.body) return;
    const student = students.find(s => s.id === form.studentId);
    
    try {
      const res = await fetch('/api/v1/teacher/parent-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, parentName: form.parentName || student?.fatherName || 'Parent' }),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(p => [{ ...newMsg, studentName: student?.name || '' }, ...p]);
        setCompose(false);
        setForm({ studentId: '', parentName: '', subject: '', body: '', category: 'general', priority: 'normal' });
      }
    } catch (error) {
      // simulate fallback for now
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        studentName: student?.name || '',
        parentName: form.parentName || student?.fatherName || 'Parent',
        subject: form.subject,
        body: form.body,
        category: form.category,
        priority: form.priority,
        createdAt: new Date().toISOString(),
        isRead: true
      };
      setMessages(p => [newMsg, ...p]);
      setCompose(false);
      setForm({ studentId: '', parentName: '', subject: '', body: '', category: 'general', priority: 'normal' });
    }
  };

  return {
    messages, setMessages,
    students, setStudents,
    selected, setSelected,
    search, setSearch,
    compose, setCompose,
    form, setForm,
    filtered,
    send
  };
}
