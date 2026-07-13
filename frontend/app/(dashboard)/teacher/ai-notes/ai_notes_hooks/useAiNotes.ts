import { useState } from 'react';
import { AiNotesError, AiNotesGenerateResponse } from '../ai_notes_types';

export function useAiNotes() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState<AiNotesError | null>(null);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    setNotes('');
    setError(null);
    try {
      const res = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, style: 'detailed' })
      });
      const data: AiNotesGenerateResponse = await res.json();
      if (!res.ok) {
        setError({ code: data.error || 'Unknown', message: data.message || 'Unknown error' });
      } else {
        setNotes(data.content);
        setProvider(data.provider);
      }
    } catch {
      setError({ code: 'NetworkError', message: 'Could not connect to the AI service.' });
    }
    setLoading(false);
  };

  const renderMarkdown = (md: string) =>
    md
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-[var(--text-primary)] mt-6 mb-3 pb-2 border-b border-[var(--border)]">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-[var(--primary)] mt-5 mb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-[var(--text-primary)] mt-4 mb-1">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[var(--text-primary)]">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-[var(--bg-input)] text-[var(--primary)] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-[#000] text-[var(--success)] p-4 rounded-xl text-sm font-mono overflow-x-auto my-3"><code>$1</code></pre>')
      .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-sm text-[var(--text-secondary)] my-1"><span class="text-[var(--primary)] mt-1">•</span><span>$1</span></li>')
      .replace(/\n\n/g, '<br/>');

  return {
    subject,
    setSubject,
    topic,
    setTopic,
    loading,
    notes,
    provider,
    error,
    generate,
    renderMarkdown
  };
}
