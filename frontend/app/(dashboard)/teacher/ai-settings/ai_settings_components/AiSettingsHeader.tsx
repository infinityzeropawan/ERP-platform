import { Sparkles } from 'lucide-react';

export function AiSettingsHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-[var(--warning)]" />AI Settings
      </h1>
      <p className="text-[var(--text-secondary)] text-sm mt-0.5">Configure AI API keys to power AI Notes and other AI features</p>
    </div>
  );
}
