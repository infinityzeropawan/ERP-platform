'use client';

import { ResourceState } from '@/lib/useResource';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Clock, Award, CheckCircle, Play, AlertCircle } from 'lucide-react';
import { useOnlineExams } from @/app/(dashboard)/student/online-exams/online_exams_hooks/useOnlineExams;
import '../../student.css';

const statusConfig = {
  upcoming:  { label: 'Upcoming', color: 'var(--student-warning)' },
  live:      { label: '🔴 Live',    color: 'var(--student-danger)' },
  completed: { label: 'Completed', color: 'var(--student-success)' },
};

export default function OnlineExamsClient() {
  const {
    onlineExams,
    loading,
    error,
    activeExam,
    answers,
    submitted,
    score,
    timeLeft,
    attempted,
    startExam,
    exitExam,
    handleSubmit,
    fmt,
    setAnswer
  } = useOnlineExams();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  // ── Attempt UI ───────────────────────────────────────────────
  if (activeExam && !submitted) {
    const answered = Object.keys(answers).length;
    const questions = activeExam.questions || [];
    return (
      <div className="space-y-4 max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between rounded-2xl p-4 shadow-sm sticky top-0 z-10"
             style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)', borderBottomWidth: '1px' }}>
          <div>
            <p className="font-bold text-lg" style={{ color: 'var(--student-text-primary)' }}>{activeExam.title}</p>
            <p className="text-xs" style={{ color: 'var(--student-text-secondary)' }}>{activeExam.subject} · {questions.length} questions · {activeExam.totalMarks} marks</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm"
                 style={{ backgroundColor: timeLeft < 300 ? 'var(--student-danger-bg)' : 'var(--student-primary-subtle)', color: timeLeft < 300 ? 'var(--student-danger)' : 'var(--student-primary)' }}>
              <Clock className="h-4 w-4" />{fmt(timeLeft)}
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--student-text-disabled)' }}>{answered}/{questions.length}</span>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-xl border p-5 bg-white transition-all shadow-sm"
                 style={{ borderColor: answers[q.id] !== undefined ? 'var(--student-primary)' : 'var(--student-border)' }}>
              <p className="text-base font-semibold mb-4" style={{ color: 'var(--student-text-primary)' }}>
                Q{i + 1}. {q.question}
                <span className="text-xs font-normal ml-2" style={{ color: 'var(--student-text-secondary)' }}>({q.marks} marks)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(q.options || []).map((opt, oi) => {
                  const isSelected = answers[q.id] === oi;
                  return (
                    <button key={oi} onClick={() => setAnswer(q.id, oi)}
                      className="text-left px-4 py-3 rounded-xl border text-sm transition-all"
                      style={{
                        backgroundColor: isSelected ? 'var(--student-primary)' : 'var(--student-bg-card)',
                        color: isSelected ? 'white' : 'var(--student-text-primary)',
                        borderColor: isSelected ? 'var(--student-primary)' : 'var(--student-border)'
                      }}>
                      <span className="font-bold mr-2 opacity-80">{String.fromCharCode(65 + oi)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end pb-8 mt-6">
          <button onClick={exitExam} className="px-6 py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}>Exit</button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 shadow-md"
                  style={{ backgroundColor: 'var(--student-primary)' }}>
            <CheckCircle className="h-4 w-4" />Submit ({answered}/{questions.length})
          </button>
        </div>
      </div>
    );
  }

  // ── Result UI ────────────────────────────────────────────────
  if (activeExam && submitted) {
    const pct = Math.round((score / activeExam.totalMarks) * 100);
    const passed = score >= activeExam.passingMarks;
    const questions = activeExam.questions || [];
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in-up">
        <div className="rounded-2xl border-2 p-8 text-center bg-white shadow-lg"
             style={{ borderColor: passed ? 'var(--student-success)' : 'var(--student-danger)' }}>
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-5 shadow-inner"
               style={{ backgroundColor: passed ? 'var(--student-success)' : 'var(--student-danger)' }}>
            {pct}%
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--student-text-primary)' }}>{passed ? '🎉 Congratulations!' : '😔 Better Luck Next Time'}</h2>
          <p className="text-sm font-medium" style={{ color: 'var(--student-text-secondary)' }}>{activeExam.title}</p>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--student-primary)' }}>{score}</p>
              <p className="text-xs uppercase tracking-wide mt-1" style={{ color: 'var(--student-text-disabled)' }}>Score</p>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--student-text-primary)' }}>{activeExam.totalMarks}</p>
              <p className="text-xs uppercase tracking-wide mt-1" style={{ color: 'var(--student-text-disabled)' }}>Total</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: passed ? 'var(--student-success-bg)' : 'var(--student-danger-bg)' }}>
              <p className="text-2xl font-bold" style={{ color: passed ? 'var(--student-success)' : 'var(--student-danger)' }}>{passed ? 'PASS' : 'FAIL'}</p>
              <p className="text-xs uppercase tracking-wide mt-1" style={{ color: 'var(--student-text-disabled)' }}>Result</p>
            </div>
          </div>

          <div className="mt-8 text-left space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--student-text-disabled)' }}>Answer Review</p>
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const correct = userAns === q.correctIndex;
              return (
                <div key={q.id} className="p-4 rounded-xl border text-sm"
                     style={{
                       backgroundColor: correct ? 'var(--student-success-bg)' : 'var(--student-danger-bg)',
                       borderColor: correct ? 'var(--student-success)' : 'var(--student-danger)'
                     }}>
                  <p className="font-semibold mb-2" style={{ color: 'var(--student-text-primary)' }}>Q{i + 1}. {q.question}</p>
                  <p className="font-medium" style={{ color: correct ? 'var(--student-success)' : 'var(--student-danger)' }}>
                    Your answer: {userAns !== undefined ? q.options[userAns] : 'Not answered'}
                  </p>
                  {!correct && <p className="mt-1 font-semibold" style={{ color: 'var(--student-success)' }}>✓ Correct: {q.options[q.correctIndex]}</p>}
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={exitExam} className="w-full py-3 rounded-xl font-bold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--student-primary)' }}>Back to Exams</button>
      </div>
    );
  }

  // ── Exam List ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <ClipboardList className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Online Exams
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>MCQ-based online examinations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {onlineExams.map((exam, i) => {
          const attempt = attempted[exam.id];
          const canAttempt = exam.status === 'upcoming' || exam.status === 'live';
          const questions = exam.questions || [];
          const statusCfg = statusConfig[exam.status];

          return (
            <div key={exam.id} className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
                 style={{ animationDelay: `${i * 50}ms`, borderColor: exam.status === 'live' ? 'var(--student-danger)' : 'var(--student-border)' }}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base leading-tight" style={{ color: 'var(--student-text-primary)' }}>{exam.title}</h3>
                    <p className="text-xs mt-1 font-medium" style={{ color: 'var(--student-text-secondary)' }}>{exam.subject}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full border"
                        style={{ color: statusCfg.color, borderColor: statusCfg.color, backgroundColor: `${statusCfg.color}10` }}>
                    {statusCfg.label}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs font-medium mb-4" style={{ color: 'var(--student-text-disabled)' }}>
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Clock className="h-3 w-3" />{exam.durationMins}m</span>
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Award className="h-3 w-3" />{exam.totalMarks}m</span>
                  <span className="bg-gray-50 px-2 py-1 rounded-md">Pass: {exam.passingMarks}</span>
                  <span className="bg-gray-50 px-2 py-1 rounded-md">❓ {questions.length} Qs</span>
                </div>
                
                <div className="text-xs font-medium mb-5 py-2 px-3 rounded-lg border border-dashed" style={{ color: 'var(--student-text-secondary)', backgroundColor: 'var(--student-bg-card)' }}>
                  📅 {new Date(exam.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>

                {attempt ? (
                  <div className="flex items-center justify-between p-3 rounded-xl border"
                       style={{ backgroundColor: attempt.score >= exam.passingMarks ? 'var(--student-success-bg)' : 'var(--student-danger-bg)', borderColor: attempt.score >= exam.passingMarks ? 'var(--student-success)' : 'var(--student-danger)' }}>
                    <span className="text-xs font-bold" style={{ color: 'var(--student-text-primary)' }}>Score: {attempt.score}/{attempt.total}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: attempt.score >= exam.passingMarks ? 'var(--student-success)' : 'var(--student-danger)' }}>
                      {attempt.score >= exam.passingMarks ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                ) : canAttempt ? (
                  <button onClick={() => startExam(exam)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 shadow-md"
                          style={{ backgroundColor: 'var(--student-primary)' }}>
                    <Play className="h-4 w-4" />Start Exam
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold rounded-xl p-3"
                       style={{ backgroundColor: 'var(--student-bg-card)', color: 'var(--student-text-disabled)' }}>
                    <AlertCircle className="h-4 w-4" />Exam completed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {onlineExams.length === 0 && (
        <div className="text-center py-16 rounded-2xl border border-dashed" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)', color: 'var(--student-text-disabled)' }}>
          No MCQ online examinations scheduled.
        </div>
      )}
    </div>
  );
}
