'use client';
import { Layers, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AiNotesHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Layers className="h-6 w-6 text-[var(--primary)]" />
          AI Notes Generator
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Generate smart study notes powered by real AI</p>
      </div>
      <Link href="/teacher/ai-settings">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">
          <Settings className="h-3.5 w-3.5" />AI Settings
        </Button>
      </Link>
    </div>
  );
}
