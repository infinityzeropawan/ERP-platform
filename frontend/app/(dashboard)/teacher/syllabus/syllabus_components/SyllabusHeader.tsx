// RESPONSIBILITY: Renders the header section of the Syllabus page with title and add button.
"use client";

import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SyllabusHeaderProps {
  onAddUnit: () => void;
}

export default function SyllabusHeader({ onAddUnit }: SyllabusHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Syllabus Tracker
        </h1>
        <p className="text-text-secondary text-sm mt-0.5">Track unit-wise syllabus completion</p>
      </div>
      <Button onClick={onAddUnit} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Unit
      </Button>
    </div>
  );
}
