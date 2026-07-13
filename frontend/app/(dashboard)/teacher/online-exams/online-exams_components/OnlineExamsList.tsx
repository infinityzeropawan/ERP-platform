import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { OnlineExam } from '../online-exams_types';

interface Props {
  exams: OnlineExam[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}

export function OnlineExamsList({ exams, expandedId, setExpandedId }: Props) {
  const statusConfig = {
    upcoming: { variant: 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]' },
    live: { variant: 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]' },
    completed: { variant: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]' },
  };

  return (
    <div className="space-y-3">
      {exams.map(exam => (
        <Card key={exam.id} className="bg-[var(--bg-card)] border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-[var(--text-primary)]">{exam.title}</p>
                  <Badge className={statusConfig[exam.status].variant}>{exam.status}</Badge>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{exam.subject} ({exam.subjectCode})</p>
                <div className="flex flex-wrap gap-4 mt-1 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exam.durationMins} min</span>
                  <span className="flex items-center gap-1"><Award className="h-3 w-3" />{exam.totalMarks} marks | Pass: {exam.passingMarks}</span>
                  <span>📅 {new Date(exam.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <span>❓ {exam.questions.length} questions</span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)} className="flex items-center gap-1 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-input)]">
                {expandedId === exam.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}Questions
              </Button>
            </div>

            {expandedId === exam.id && (
              <div className="mt-4 border-t border-[var(--border)] pt-4 space-y-3">
                {exam.questions.map((q, i) => (
                  <div key={q.id} className="bg-[var(--bg-input)] rounded-xl p-3">
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Q{i + 1}. {q.question} <span className="text-xs text-[var(--primary)] font-normal">({q.marks} marks)</span></p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`text-xs px-3 py-1.5 rounded-lg border ${oi === q.correctIndex ? 'bg-[var(--success-bg)] border-[var(--success)] text-[var(--success)] font-semibold' : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)]'}`}>
                          {String.fromCharCode(65 + oi)}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
