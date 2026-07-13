// RESPONSIBILITY: Renders an individual syllabus unit row.
"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SyllabusUnit, SyllabusStatus } from '../syllabus_types/syllabus_types';
import { SYLLABUS_STATUS_CONFIG } from '../syllabus_utils/syllabus_constants';

export interface SyllabusUnitRowProps {
  unit: SyllabusUnit;
  onUpdateStatus: (id: string, status: SyllabusStatus) => void;
  onEdit: (unit: SyllabusUnit) => void;
}

export default function SyllabusUnitRow({ unit, onUpdateStatus, onEdit }: SyllabusUnitRowProps) {
  const cfg = SYLLABUS_STATUS_CONFIG[unit.status] || SYLLABUS_STATUS_CONFIG['pending'];
  const unitPct = unit.totalHours > 0 ? Math.round((unit.completedHours / unit.totalHours) * 100) : 0;

  return (
    <div className="px-4 py-3 hover:bg-[rgba(99,102,241,0.06)] transition-all duration-200 ease-in-out border-b border-border last:border-b-0">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-text-secondary bg-bg-input px-2 py-0.5 rounded">
              Unit {unit.unitNo}
            </span>
            <p className="text-sm font-semibold text-text-primary">{unit.unitTitle}</p>
            <Badge className={`${cfg.color} border border-border`} variant={cfg.variant as any}>
              {cfg.label}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(unit.topics || []).map((t) => (
              <span
                key={t}
                className="text-xs bg-primary-subtle text-primary border border-border px-2 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-text-secondary">
              {unit.completedHours}/{unit.totalHours} hrs
            </span>
            <div className="flex items-center gap-1.5 w-24">
              <Progress
                value={unitPct}
                max={100}
                className="flex-1 h-1.5"
                color={unitPct === 100 ? 'bg-success' : 'bg-primary'}
              />
              <span className="text-xs text-text-secondary">{unitPct}%</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {unit.status !== 'completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onUpdateStatus(unit.id, unit.status === 'pending' ? 'in_progress' : 'completed')
              }
              className="text-xs border-border text-text-primary hover:bg-bg-input transition-all duration-200"
            >
              {unit.status === 'pending' ? 'Start' : 'Mark Done'}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(unit)}
            className="text-xs border-border text-text-primary hover:bg-bg-input transition-all duration-200"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
