'use client';

import { useState } from 'react';
import { MessageSquare, Star, CheckCircle, Send, User, BookOpen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useFeedback } from '../../student_hooks/useFeedback';
import '../../student.css';

export default function FeedbackClient() {
  const { targets, loading, submitting, submitFeedback } = useFeedback();
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (loading) {
    return <div className="p-8 text-center" style={{ color: 'var(--student-text-disabled)' }}>Loading feedback options...</div>;
  }

  const handleSubmit = async () => {
    if (!selectedTarget || rating === 0) return;
    const success = await submitFeedback(selectedTarget, rating, comment);
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedTarget('');
        setRating(0);
        setComment('');
      }, 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--student-primary-subtle)' }}>
          <MessageSquare className="h-8 w-8" style={{ color: 'var(--student-primary)' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--student-text-primary)' }}>Share Your Feedback</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--student-text-secondary)' }}>Your input helps us improve the learning experience.</p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl border p-12 text-center shadow-sm animate-scale-in" style={{ borderColor: 'var(--student-border)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--student-success-bg)' }}>
            <CheckCircle className="h-10 w-10" style={{ color: 'var(--student-success)' }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--student-text-primary)' }}>Thank You!</h2>
          <p className="mt-2" style={{ color: 'var(--student-text-secondary)' }}>Your feedback has been submitted successfully and will be reviewed by the administration.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border p-8 shadow-sm animate-fade-in-up" style={{ borderColor: 'var(--student-border)' }}>
          <div className="space-y-8">
            <div>
              <label className="text-sm font-semibold uppercase tracking-wider mb-4 block" style={{ color: 'var(--student-text-secondary)' }}>
                1. What are you providing feedback for?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {targets.map(t => (
                  <button key={t.id} onClick={() => setSelectedTarget(t.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${selectedTarget === t.id ? 'ring-2 shadow-md' : 'hover:bg-gray-50'}`}
                    style={{
                      borderColor: selectedTarget === t.id ? 'var(--student-primary)' : 'var(--student-border)',
                      backgroundColor: selectedTarget === t.id ? 'var(--student-primary-subtle)' : 'var(--student-bg-card)',
                      color: selectedTarget === t.id ? 'var(--student-primary)' : 'var(--student-text-primary)'
                    }}>
                    <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--student-bg-input)' }}>
                      {t.type === 'teacher' ? <User className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs opacity-80 capitalize">{t.type}</p>
                    </div>
                  </button>
                ))}
                {targets.length === 0 && (
                   <div className="col-span-2 text-center p-4 text-sm" style={{ color: 'var(--student-text-disabled)' }}>No active classes or teachers available for feedback.</div>
                )}
              </div>
            </div>

            <div className={`transition-opacity duration-300 ${!selectedTarget ? 'opacity-30 pointer-events-none' : ''}`}>
              <label className="text-sm font-semibold uppercase tracking-wider mb-4 block" style={{ color: 'var(--student-text-secondary)' }}>
                2. Rate your experience
              </label>
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-2 transition-transform hover:scale-110">
                    <Star className="h-10 w-10 transition-colors"
                      fill={(hoverRating || rating) >= star ? 'var(--student-warning)' : 'transparent'}
                      style={{ color: (hoverRating || rating) >= star ? 'var(--student-warning)' : 'var(--student-border)' }} />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm font-medium h-5" style={{ color: 'var(--student-text-secondary)' }}>
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            <div className={`transition-opacity duration-300 ${!rating ? 'opacity-30 pointer-events-none' : ''}`}>
              <label className="text-sm font-semibold uppercase tracking-wider mb-4 block" style={{ color: 'var(--student-text-secondary)' }}>
                3. Tell us more (Optional)
              </label>
              <Textarea
                placeholder="What went well? What could be improved?"
                value={comment} onChange={e => setComment(e.target.value)}
                className="min-h-[120px] rounded-2xl resize-none"
                style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}
              />
            </div>

            <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--student-border)' }}>
              <button
                disabled={!selectedTarget || rating === 0 || submitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3.5 text-white font-bold rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{ backgroundColor: 'var(--student-primary)' }}>
                {submitting ? 'Submitting...' : <><Send className="h-5 w-5" /> Submit Feedback</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
