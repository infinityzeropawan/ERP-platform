// RESPONSIBILITY: Renders a card displaying syllabus units for a specific subject.
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { SyllabusUnit, SyllabusStatus } from '../syllabus_types/syllabus_types';
import SyllabusUnitRow from './SyllabusUnitRow';

export interface SyllabusSubjectCardProps {
  subject: string;
  units: SyllabusUnit[];
  onUpdateStatus: (id: string, status: SyllabusStatus) => void;
  onEdit: (unit: SyllabusUnit) => void;
}

export default function SyllabusSubjectCard({
  subject,
  units,
  onUpdateStatus,
  onEdit,
}: SyllabusSubjectCardProps) {
  const totalHrs = units.reduce((a, u) => a + u.totalHours, 0);
  const doneHrs = units.reduce((a, u) => a + u.completedHours, 0);
  const pct = totalHrs > 0 ? Math.round((doneHrs / totalHrs) * 100) : 0;

  return (
    <Card className="bg-bg-card border-border hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base flex items-center gap-2 text-text-primary">
            <BookOpen className="h-4 w-4 text-primary" />
            {subject}
            <span className="text-xs text-text-secondary font-normal">
              ({units[0]?.subjectCode})
            </span>
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary">
              {doneHrs}/{totalHrs} hrs
            </span>
            <div className="flex items-center gap-2 w-32">
              <Progress
                value={pct}
                max={100}
                className="flex-1 h-2"
                color={pct === 100 ? 'bg-success' : 'bg-primary'}
              />
              <span className="text-xs font-bold text-primary">{pct}%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {units.map((unit) => (
            <SyllabusUnitRow
              key={unit.id}
              unit={unit}
              onUpdateStatus={onUpdateStatus}
              onEdit={onEdit}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
