'use client';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AiNotesGeneratorFormProps {
  subject: string;
  setSubject: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  loading: boolean;
  generate: () => void;
}

export function AiNotesGeneratorForm({
  subject,
  setSubject,
  topic,
  setTopic,
  loading,
  generate
}: AiNotesGeneratorFormProps) {
  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-[var(--text-primary)]">
          <Sparkles className="h-4 w-4 text-[var(--warning)]" />
          Generate Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Subject (optional)</label>
            <Input 
              placeholder="e.g. Computer Science, Mathematics..." 
              value={subject} 
              onChange={e => setSubject(e.target.value)}
              className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" 
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Topic *</label>
            <Textarea 
              placeholder="e.g. MQTT Protocol, Photosynthesis, Calculus..." 
              value={topic} 
              onChange={e => setTopic(e.target.value)} 
              rows={1} 
              className="resize-none bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" 
            />
          </div>
        </div>
        <Button 
          onClick={generate} 
          disabled={loading || !topic} 
          className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white disabled:opacity-50"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
          ) : (
            <><Sparkles className="h-4 w-4" />Generate Notes with AI</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
