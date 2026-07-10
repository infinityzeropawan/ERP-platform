'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useResource, ResourceState } from '@/lib/useResource';
import { ClipboardList, Clock, Award, CheckCircle, Play, AlertCircle } from 'lucide-react';

type MCQQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  marks: number;
};

type OnlineExam = {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  durationMins: number;
  totalMarks: number;
  passingMarks: number;
  scheduledAt: string;
  status: 'upcoming' | 'live' | 'completed';
  questions: MCQQuestion[];
};

type ExamAttempt = {
  id: string;
  examId: string;
  answers: Record<string, number>;
  score: number;
  passed: boolean;
  submittedAt: string;
};

const statusConfig = {
  upcoming: { variant: 'warning' as const, label: 'Upcoming' },
  live: { variant: 'danger' as const, label: '🔴 Live' },
  completed: { variant: 'success' as const, label: 'Completed' },
};

export default function StudentOnlineExamsPage() {
  const { data: onlineExams, loading: loadingExams, error: errorExams } = useResource<OnlineExam>('online-exams');
  const { data: dbAttempts, loading: loadingAttempts, error: errorAttempts, create: createAttempt } = useResource<ExamAttempt>('exam-attempts');

  const [activeExam, setActiveExam] = useState<OnlineExam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attempted, setAttempted] = useState<Record<string, { score: number; total: number }>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync DB attempts into local attempted state map
  useEffect(() => {
    if (dbAttempts) {
      const map: Record<string, { score: number; total: number }> = {};
      dbAttempts.forEach(att => {
        const exam = onlineExams.find(e => e.id === att.examId);
        map[att.examId] = {
          score: att.score,
          total: exam ? exam.totalMarks : 100
        };
      });
      setAttempted(map);
    }
  }, [dbAttempts, onlineExams]);

  useEffect(() => {
    if (!activeExam || submitted) return;
    setTimeLeft(activeExam.durationMins * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          void handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeExam, submitted]);

  const handleSubmit = async () => {
    if (!activeExam) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    let earned = 0;
    activeExam.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) earned += q.marks;
    });

    const passed = earned >= activeExam.passingMarks;

    try {
      await createAttempt({
        examId: activeExam.id,
        answers,
        score: earned,
        passed,
        submittedAt: new Date().toISOString()
      });
      
      setScore(earned);
      setSubmitted(true);
      setAttempted(p => ({ ...p, [activeExam.id]: { score: earned, total: activeExam.totalMarks } }));
    } catch (err: any) {
      alert(`Error submitting exam attempt: ${err.message}`);
    }
  };

  const startExam = (exam: OnlineExam) => {
    setActiveExam(exam);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const exitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveExam(null);
    setSubmitted(false);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (loadingExams || loadingAttempts || errorExams || errorAttempts) {
    return <ResourceState loading={loadingExams || loadingAttempts} error={errorExams || errorAttempts} />;
  }

  // ── Attempt UI ───────────────────────────────────────────────
  if (activeExam && !submitted) {
    const answered = Object.keys(answers).length;
    const questions = activeExam.questions || [];
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 shadow-sm sticky top-0 z-10">
          <div>
            <p className="font-bold text-gray-900">{activeExam.title}</p>
            <p className="text-xs text-gray-400">{activeExam.subject} · {questions.length} questions · {activeExam.totalMarks} marks</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm ${timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'}`}>
              <Clock className="h-4 w-4" />{fmt(timeLeft)}
            </div>
            <span className="text-xs text-gray-400">{answered}/{questions.length}</span>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <Card key={q.id} className={answers[q.id] !== undefined ? 'border-teal-200' : ''}>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Q{i + 1}. {q.question}
                  <span className="text-xs text-teal-600 font-normal ml-2">({q.marks} marks)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(q.options || []).map((opt, oi) => (
                    <button key={oi} onClick={() => setAnswers(p => ({ ...p, [q.id]: oi }))}
                      className={`text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
                        answers[q.id] === oi
                          ? 'bg-teal-600 text-white border-teal-600 font-medium'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50'
                      }`}>
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 justify-end pb-4">
          <Button variant="outline" onClick={exitExam}>Exit</Button>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />Submit ({answered}/{questions.length} answered)
          </Button>
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
      <div className="max-w-lg mx-auto space-y-4">
        <Card className={`border-2 ${passed ? 'border-green-300' : 'border-red-300'}`}>
          <CardContent className="p-8 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 ${passed ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>
              {pct}%
            </div>
            <h2 className="text-xl font-bold text-gray-900">{passed ? '🎉 Congratulations!' : '😔 Better Luck Next Time'}</h2>
            <p className="text-gray-500 text-sm mt-1">{activeExam.title}</p>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-teal-700">{score}</p><p className="text-xs text-gray-400">Score</p></div>
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-700">{activeExam.totalMarks}</p><p className="text-xs text-gray-400">Total</p></div>
              <div className={`rounded-xl p-3 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{passed ? 'PASS' : 'FAIL'}</p>
                <p className="text-xs text-gray-400">Result</p>
              </div>
            </div>
            <div className="mt-6 text-left space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Answer Review</p>
              {questions.map((q, i) => {
                const userAns = answers[q.id];
                const correct = userAns === q.correctIndex;
                return (
                  <div key={q.id} className={`p-3 rounded-xl text-xs ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className="font-medium text-gray-800">Q{i + 1}. {q.question}</p>
                    <p className={`mt-1 ${correct ? 'text-green-700' : 'text-red-600'}`}>
                      Your answer: {userAns !== undefined ? q.options[userAns] : 'Not answered'}
                    </p>
                    {!correct && <p className="text-green-700 mt-0.5">✓ Correct: {q.options[q.correctIndex]}</p>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Button onClick={exitExam} className="w-full">Back to Exams</Button>
      </div>
    );
  }

  // ── Exam List ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ClipboardList className="h-6 w-6 text-teal-600" />Online Exams</h1>
        <p className="text-gray-500 text-sm mt-0.5">MCQ-based online examinations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {onlineExams.map(exam => {
          const attempt = attempted[exam.id];
          const canAttempt = exam.status === 'upcoming' || exam.status === 'live';
          const questions = exam.questions || [];
          return (
            <Card key={exam.id} className={exam.status === 'live' ? 'border-red-200 ring-2 ring-red-100' : ''}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{exam.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{exam.subject}</p>
                  </div>
                  <Badge variant={statusConfig[exam.status]?.variant as any || 'outline'}>{statusConfig[exam.status]?.label || exam.status}</Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exam.durationMins} min</span>
                  <span className="flex items-center gap-1"><Award className="h-3 w-3" />{exam.totalMarks} marks</span>
                  <span>Pass: {exam.passingMarks}</span>
                  <span>❓ {questions.length} Qs</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  📅 {new Date(exam.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                {attempt ? (
                  <div className={`flex items-center justify-between p-3 rounded-xl ${attempt.score >= exam.passingMarks ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <span className="text-xs font-medium text-gray-700">Score: {attempt.score}/{attempt.total}</span>
                    <Badge variant={attempt.score >= exam.passingMarks ? 'success' : 'danger'}>
                      {attempt.score >= exam.passingMarks ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                ) : canAttempt ? (
                  <Button onClick={() => startExam(exam)} className="w-full flex items-center justify-center gap-2">
                    <Play className="h-4 w-4" />Start Exam
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                    <AlertCircle className="h-4 w-4" />Exam completed
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {onlineExams.length === 0 && (
          <div className="text-sm text-gray-400 col-span-2 text-center py-10 bg-gray-50 border border-dashed rounded-2xl">
            No MCQ online examinations scheduled at this time.
          </div>
        )}
      </div>
    </div>
  );
}
