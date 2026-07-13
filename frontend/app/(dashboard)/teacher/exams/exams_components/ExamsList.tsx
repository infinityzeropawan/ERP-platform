import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ClipboardCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Exam, Student } from '../exams_types';

interface Props {
  exams: Exam[];
  students: Student[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  setResultsExamId: (id: string | null) => void;
  setResultInputs: (inputs: Record<string, string>) => void;
}

export function ExamsList({ exams, students, expandedId, setExpandedId, setResultsExamId, setResultInputs }: Props) {
  return (
    <div className="space-y-3">
      {exams.map(exam => (
        <Card key={exam.id} className={exam.status === 'scheduled' ? 'border-[var(--warning)] bg-[var(--bg-card)]' : 'border-[var(--success)] bg-[var(--bg-card)]'}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-[var(--text-primary)]">{exam.subject}</p>
                  <Badge className={exam.status === 'scheduled' ? 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]' : 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]'}>{exam.status}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-[var(--purple)]" />{exam.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[var(--info)]" />{exam.time} · {exam.duration}</span>
                  {exam.room && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-[var(--primary)]" />{exam.room}</span>}
                  <span className="text-xs text-[var(--text-secondary)]">Max: {exam.maxMarks} | Pass: {exam.passingMarks}</span>
                </div>
                {exam.syllabus && <p className="text-xs text-[var(--text-secondary)] mt-1">📚 {exam.syllabus}</p>}
              </div>
              <div className="flex gap-2">
                {exam.status === 'scheduled' && (
                  <Button size="sm" onClick={() => { setResultsExamId(exam.id); setResultInputs({}); }} className="flex items-center gap-1 bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--primary-subtle)] hover:text-[var(--primary)] transition-colors">
                    <ClipboardCheck className="h-3.5 w-3.5" />Enter Results
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)} className="flex items-center gap-1 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-input)]">
                  {expandedId === exam.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}Students
                </Button>
              </div>
            </div>
            {expandedId === exam.id && (
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <p className="text-xs text-[var(--text-secondary)]">{students.length} students enrolled in this class.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
