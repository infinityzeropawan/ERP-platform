import { useState, useMemo } from 'react';

export type SyllabusUnit = {
  id: string;
  subjectCode: string;
  subject: string;
  unitNo: number;
  unitTitle: string;
  topics: string[];
  totalHours: number;
  completedHours: number;
  status: 'completed' | 'in_progress' | 'pending';
};

export function useSyllabus() {
  const [syllabusUnits, setSyllabusUnits] = useState<SyllabusUnit[]>([]);

  const subjects = useMemo(() => Array.from(new Set(syllabusUnits.map(u => u.subjectCode))), [syllabusUnits]);
  
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggleSubject = (code: string) => {
    setOpen(p => ({ ...p, [code]: !p[code] }));
  };

  const completedCount = syllabusUnits.filter(u => u.status === 'completed').length;
  const inProgressCount = syllabusUnits.filter(u => u.status === 'in_progress').length;
  const pendingCount = syllabusUnits.filter(u => u.status === 'pending').length;

  return {
    syllabusUnits,
    subjects,
    open,
    toggleSubject,
    stats: {
      completedCount,
      inProgressCount,
      pendingCount
    }
  };
}
