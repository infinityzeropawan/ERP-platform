'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Layers, Sparkles, BookOpen, Settings, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAiNotes } from '../../student_hooks/useAiNotes';
import '../../student.css';

export default function AiNotesClient() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const { loading, notes, provider, error, generate } = useAiNotes();

  const handleGenerate = () => {
    generate(topic, subject);
  };

  const renderMarkdown = (md: string) =>
    md
      .replace(/^# (.+)$/gm, `<h1 class="text-2xl font-bold mt-6 mb-3 pb-2 border-b" style="color: var(--student-text-primary); border-color: var(--student-border)">$1</h1>`)
      .replace(/^## (.+)$/gm, `<h2 class="text-lg font-semibold mt-5 mb-2" style="color: var(--student-primary)">$1</h2>`)
      .replace(/^### (.+)$/gm, `<h3 class="text-base font-semibold mt-4 mb-1" style="color: var(--student-text-primary)">$1</h3>`)
      .replace(/\*\*(.+?)\*\*/g, `<strong class="font-semibold" style="color: var(--student-text-primary)">$1</strong>`)
      .replace(/`([^`]+)`/g, `<code class="px-1.5 py-0.5 rounded text-sm font-mono" style="background-color: var(--student-bg-input); color: var(--student-primary)">$1</code>`)
      .replace(/```[\w]*\n([\s\S]*?)```/g, `<pre class="p-4 rounded-xl text-sm font-mono overflow-x-auto my-3" style="background-color: var(--student-text-primary); color: var(--student-success)"><code>$1</code></pre>`)
      .replace(/^- (.+)$/gm, `<li class="flex items-start gap-2 text-sm my-1" style="color: var(--student-text-secondary)"><span class="mt-1" style="color: var(--student-primary)">•</span><span>$1</span></li>`)
      .replace(/\n\n/g, '<br/>');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <Layers className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />AI Notes Generator
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Generate smart study notes powered by real AI</p>
        </div>
        <Link href="/student/ai-settings">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5" style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}>
            <Settings className="h-3.5 w-3.5" />AI Settings
          </Button>
        </Link>
      </div>

      <Card style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <Sparkles className="h-4 w-4" style={{ color: 'var(--student-warning)' }} />Generate Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--student-text-secondary)' }}>Subject (optional)</label>
              <Input placeholder="e.g. Computer Science, Mathematics..." value={subject} onChange={e => setSubject(e.target.value)} style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--student-text-secondary)' }}>Topic *</label>
              <Textarea placeholder="e.g. MQTT Protocol, Photosynthesis, Calculus..." value={topic} onChange={e => setTopic(e.target.value)} rows={1} className="resize-none" style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }} />
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={loading || !topic} className="flex items-center gap-2" style={{ backgroundColor: 'var(--student-primary)', color: 'white' }}>
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4" />Generate Notes with AI</>}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card style={{ backgroundColor: 'var(--student-danger-bg)', borderColor: 'var(--student-danger)' }}>
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--student-danger)' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--student-danger)' }}>{error.code === 'NoAiKey' ? 'No AI Key Configured' : 'AI Error'}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--student-danger)' }}>{error.message}</p>
              {error.code === 'NoAiKey' && (
                <Link href="/student/ai-settings" className="text-xs underline mt-1 inline-block" style={{ color: 'var(--student-danger)' }}>
                  → Configure your AI key here
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {notes && (
        <Card style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
                <BookOpen className="h-4 w-4" style={{ color: 'var(--student-primary)' }} />Generated Notes
              </CardTitle>
              <Badge className="flex items-center gap-1" style={{ backgroundColor: 'var(--student-warning-bg)', color: 'var(--student-warning)', border: 'none' }}>
                <Sparkles className="h-3 w-3" />Powered by {provider === 'gemini' ? 'Gemini' : 'OpenAI'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none leading-relaxed" style={{ color: 'var(--student-text-secondary)' }} dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
