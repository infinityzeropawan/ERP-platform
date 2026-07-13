import { useState, useEffect } from 'react';

export interface Message {
  id: string;
  subject: string;
  body: string;
  teacherId: string;
  category: string;
  priority: string;
  createdAt: string;
  isRead: boolean;
}

export function useMessaging() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/resources/notices')
      .then(r => r.ok ? r.json() : [])
      .then((notices: Array<{ id: string; title: string; content: string; publishedAt: string; authorName: string }>) => {
        setMessages(notices.map(n => ({
          id: n.id,
          subject: n.title,
          body: n.content,
          teacherId: n.authorName,
          category: 'notice',
          priority: 'normal',
          createdAt: n.publishedAt,
          isRead: false,
        })));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return {
    messages,
    selected,
    setSelected,
    loading
  };
}
