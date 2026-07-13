import { useState } from 'react';

export function useAiNotes() {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  const generate = async (topic: string, subject: string) => {
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
      const data = await res.json();
      if (!res.ok) {
        setError({ code: data.error, message: data.message });
      } else {
        setNotes(data.content);
        setProvider(data.provider);
      }
    } catch {
      setError({ code: 'NetworkError', message: 'Could not connect to the AI service.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    notes,
    provider,
    error,
    generate
  };
}
