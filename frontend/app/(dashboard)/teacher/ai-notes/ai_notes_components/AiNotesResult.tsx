'use client';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AiNotesError } from '../ai_notes_types';

interface AiNotesResultProps {
  notes: string;
  provider: string;
  error: AiNotesError | null;
  renderMarkdown: (md: string) => string;
}

export function AiNotesResult({ notes, provider, error, renderMarkdown }: AiNotesResultProps) {
  if (error) {
    return (
      <Card className="border-[var(--danger)] bg-[var(--danger-bg)]">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[var(--danger)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[var(--danger)] text-sm">
              {error.code === 'NoAiKey' ? 'No AI Key Configured' : 'AI Error'}
            </p>
            <p className="text-xs text-[var(--danger)] mt-0.5 opacity-80">{error.message}</p>
            {error.code === 'NoAiKey' && (
              <Link href="/teacher/ai-settings" className="text-xs text-[var(--danger)] underline mt-1 inline-block hover:opacity-80">
                → Configure your AI key here
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notes) {
    return (
      <Card className="bg-[var(--bg-card)] border-[var(--border)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2 text-[var(--text-primary)]">
              <BookOpen className="h-4 w-4 text-[var(--primary)]" />
              Generated Notes
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1 bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]">
              <Sparkles className="h-3 w-3" />
              Powered by {provider === 'gemini' ? 'Gemini' : 'OpenAI'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="prose max-w-none text-[var(--text-primary)] leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }} 
          />
        </CardContent>
      </Card>
    );
  }

  return null;
}
