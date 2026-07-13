import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

export interface FeedbackTarget {
  id: string;
  name: string;
  type: 'teacher' | 'class';
}

export function useFeedback() {
  const { token } = useAuth();
  const [targets, setTargets] = useState<FeedbackTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('/api/v1/student/feedback-targets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setTargets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching feedback targets:', err);
        setError('Failed to load targets');
        setLoading(false);
      });
  }, [token]);

  const submitFeedback = async (targetId: string, rating: number, comment: string) => {
    if (!token) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/student/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetId, rating, comment })
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      setSubmitting(false);
      return true;
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      return false;
    }
  };

  return {
    targets,
    loading,
    error,
    submitting,
    submitFeedback
  };
}
