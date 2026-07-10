'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Layers, Sparkles, BookOpen, Settings, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TeacherAiNotesPage() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    setNotes('');
    setError(null);
    try {
      const res = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, style: 'detailed' })
      });
      const data = await res.json();
      if (!res.ok) {
        setError({ code: data.error, message: data.message });
      } else {
        setNotes(data.content);
        setProvider(data.provider);
      }
    } catch {
      setError({ code: 'NetworkError', message: 'Could not connect to the AI service.' });
    }
    setLoading(false);
  };

  const renderMarkdown = (md: string) =>
    md
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-200">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-teal-700 mt-5 mb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-gray-800 mt-4 mb-1">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-teal-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto my-3"><code>$1</code></pre>')
      .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-sm text-gray-700 my-1"><span class="text-teal-500 mt-1">•</span><span>$1</span></li>')
      .replace(/\n\n/g, '<br/>');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Layers className="h-6 w-6 text-teal-600" />AI Notes Generator</h1>
          <p className="text-gray-500 text-sm mt-0.5">Generate smart study notes powered by real AI</p>
        </div>
        <Link href="/teacher/ai-settings">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5" />AI Settings
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Generate Notes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Subject (optional)</label>
              <Input placeholder="e.g. Computer Science, Mathematics..." value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Topic *</label>
              <Textarea placeholder="e.g. MQTT Protocol, Photosynthesis, Calculus..." value={topic} onChange={e => setTopic(e.target.value)} rows={1} className="resize-none" />
            </div>
          </div>
          <Button onClick={generate} disabled={loading || !topic} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4" />Generate Notes with AI</>}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">{error.code === 'NoAiKey' ? 'No AI Key Configured' : 'AI Error'}</p>
              <p className="text-xs text-red-600 mt-0.5">{error.message}</p>
              {error.code === 'NoAiKey' && (
                <Link href="/teacher/ai-settings" className="text-xs text-red-700 underline mt-1 inline-block">
                  → Configure your AI key here
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {notes && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-teal-600" />Generated Notes</CardTitle>
              <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                <Sparkles className="h-3 w-3" />Powered by {provider === 'gemini' ? 'Gemini' : 'OpenAI'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
