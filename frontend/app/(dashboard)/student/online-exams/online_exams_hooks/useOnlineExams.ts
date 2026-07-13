import { useState, useEffect, useRef } from 'react';
import { useResource } from '@/lib/useResource';

export type MCQQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  marks: number;
};

export type OnlineExam = {
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

export type ExamAttempt = {
  id: string;
  examId: string;
  answers: Record<string, number>;
  score: number;
  passed: boolean;
  submittedAt: string;
};

export function useOnlineExams() {
  const { data: onlineExams, loading: loadingExams, error: errorExams } = useResource<OnlineExam>('online-exams');
  const { data: dbAttempts, loading: loadingAttempts, error: errorAttempts, create: createAttempt } = useResource<ExamAttempt>('exam-attempts');

  const [activeExam, setActiveExam] = useState<OnlineExam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attempted, setAttempted] = useState<Record<string, { score: number; total: number }>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const setAnswer = (questionId: string, optionIndex: number) => {
    setAnswers(p => ({ ...p, [questionId]: optionIndex }));
  };

  return {
    onlineExams,
    loading: loadingExams || loadingAttempts,
    error: errorExams || errorAttempts,
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
  };
}
