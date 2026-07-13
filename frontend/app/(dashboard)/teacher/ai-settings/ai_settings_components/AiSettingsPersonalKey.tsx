import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Key, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AiConfig, AiSettingsMsg } from '../ai_settings_types';
import { AI_PROVIDERS } from '../ai_settings_constants';

interface Props {
  config: AiConfig | null;
  personalProvider: string;
  setPersonalProvider: (p: 'gemini' | 'openai') => void;
  personalKey: string;
  setPersonalKey: (k: string) => void;
  personalSaving: boolean;
  personalMsg: AiSettingsMsg | null;
  savePersonalKey: () => void;
  removePersonalKey: () => void;
}

export function AiSettingsPersonalKey({
  config,
  personalProvider,
  setPersonalProvider,
  personalKey,
  setPersonalKey,
  personalSaving,
  personalMsg,
  savePersonalKey,
  removePersonalKey,
}: Props) {
  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-[var(--text-primary)]">
          <User className="h-4 w-4 text-[var(--primary)]" />Your Personal AI Key
          <Badge variant="outline" className="text-[10px] ml-auto border-[var(--border)] text-[var(--text-secondary)]">Optional — overrides institution key</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {AI_PROVIDERS.map(p => (
            <button
              key={p.value}
              onClick={() => setPersonalProvider(p.value as any)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-colors ${personalProvider === p.value ? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-focus)]'}`}
            >
              <span>{p.logo}</span>{p.label}
            </button>
          ))}
        </div>

        <div>
          <p className="text-xs text-[var(--text-secondary)] mb-1">
            {AI_PROVIDERS.find(p => p.value === personalProvider)?.hint}
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Paste your API key here..."
              value={personalKey}
              onChange={e => setPersonalKey(e.target.value)}
              className="flex-1 font-mono text-sm bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
            />
            <Button onClick={savePersonalKey} disabled={!personalKey.trim() || personalSaving} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white disabled:opacity-50">
              {personalSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {config?.configured && config.scope === 'personal' && (
          <Button variant="outline" size="sm" onClick={removePersonalKey} className="text-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger-bg)]">
            <Trash2 className="h-3.5 w-3.5 mr-1" />Remove my personal key
          </Button>
        )}

        {personalMsg && (
          <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${personalMsg.type === 'success' ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--danger-bg)] text-[var(--danger)]'}`}>
            {personalMsg.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {personalMsg.text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
