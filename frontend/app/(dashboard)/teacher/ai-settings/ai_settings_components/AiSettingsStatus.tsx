import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import { AiConfig } from '../ai_settings_types';

interface Props {
  config: AiConfig | null;
  loading: boolean;
}

export function AiSettingsStatus({ config, loading }: Props) {
  return (
    <>
      {loading ? (
        <Card className="bg-[var(--bg-card)] border-[var(--border)]"><CardContent className="p-6 flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" /><span className="text-sm text-[var(--text-secondary)]">Loading configuration...</span></CardContent></Card>
      ) : (
        <Card className={`border-2 ${config?.configured ? 'border-[var(--success)] bg-[var(--success-bg)]' : 'border-[var(--warning)] bg-[var(--warning-bg)]'}`}>
          <CardContent className="p-4 flex items-center gap-3">
            {config?.configured
              ? <CheckCircle className="h-5 w-5 text-[var(--success)] flex-shrink-0" />
              : <AlertCircle className="h-5 w-5 text-[var(--warning)] flex-shrink-0" />}
            <div>
              {config?.configured ? (
                <>
                  <p className="font-semibold text-[var(--success)] text-sm">AI is configured and ready</p>
                  <p className="text-xs text-[var(--success)] opacity-80">
                    Using <strong className="capitalize">{config.provider}</strong> API •
                    Source: <Badge variant="outline" className="text-[10px] ml-1 py-0 capitalize border-[var(--success)] text-[var(--success)]">{config.scope === 'personal' ? '👤 Your personal key' : '🏛️ Institution key'}</Badge>
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-[var(--warning)] text-sm">No AI key configured</p>
                  <p className="text-xs text-[var(--warning)] opacity-80">Configure your personal key below, or ask your admin to set an institution-wide key</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-[var(--info)] bg-[var(--info-bg)]">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-[var(--text-primary)] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--text-primary)] space-y-1 opacity-90">
              <p className="font-semibold">Key Priority (highest to lowest)</p>
              <p>1. 👤 Your personal key (overrides everything)</p>
              <p>2. 🏛️ Institution key (set by admin — shared by all)</p>
              <p>3. ❌ No key → AI features will show an error</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
