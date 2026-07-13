import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useResource } from '@/lib/useResource';

export type DoubtReply = {
  id: string;
  authorName: string;
  authorRole: 'teacher' | 'student';
  content: string;
  createdAt: string;
  isAccepted?: boolean;
};

export type Doubt = {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  askedBy: string;
  createdAt: string;
  status: 'open' | 'answered' | 'closed';
  replies: DoubtReply[];
  tags: string[];
};

export const subjectNames: Record<string, string> = {
  IOT101: 'IOT & Embedded Systems',
  IOT102: 'Embedded C Programming',
  IOT103: 'Network Protocols'
};

export function useDoubts() {
  const { user } = useAuth();
  const { data: allDoubts, loading, error, reload: reloadDoubts, create: createDoubtApi } = useResource<Doubt>('doubts');
  const { create: createReplyApi } = useResource<any>('doubt-replies');

  const submitReply = async (doubtId: string, text: string) => {
    if (!text.trim()) return;
    try {
      await createReplyApi({
        doubtId,
        authorName: user?.name || 'Aarav Sharma',
        authorRole: user?.role === 'teacher' ? 'teacher' : 'student',
        content: text.trim(),
        isAccepted: false
      });
      await reloadDoubts();
    } catch (err: any) {
      throw new Error(`Error posting reply: ${err.message}`);
    }
  };

  const askDoubt = async (form: { subject: string; title: string; description: string; tags: string }) => {
    if (!form.title.trim() || !form.description.trim()) return;
    try {
      await createDoubtApi({
        subjectCode: form.subject,
        subjectName: subjectNames[form.subject] || 'General',
        title: form.title,
        description: form.description,
        askedBy: user?.name || 'Student',
        status: 'open',
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString()
      });
      await reloadDoubts();
    } catch (err: any) {
      throw new Error(`Error posting doubt: ${err.message}`);
    }
  };

  return {
    allDoubts,
    loading,
    error,
    submitReply,
    askDoubt
  };
}
