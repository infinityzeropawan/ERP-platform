'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Key, Trash2, CheckCircle, AlertCircle, Loader2, Info, Globe, User } from 'lucide-react';

interface AiConfig {
  configured: boolean;
  scope?: 'personal' | 'institution';
  provider?: string;
}

interface Props {
  showInstitutionSection?: boolean; // only admins see this
}

export default function AiSettingsPage({ showInstitutionSection = false }: Props) {
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Personal key form
  const [personalProvider, setPersonalProvider] = useState<'gemini' | 'openai'>('gemini');
  const [personalKey, setPersonalKey] = useState('');
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalMsg, setPersonalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Institution key form (admin only)
  const [instProvider, setInstProvider] = useState<'gemini' | 'openai'>('gemini');
  const [instKey, setInstKey] = useState('');
  const [instSaving, setInstSaving] = useState(false);
  const [instMsg, setInstMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    const res = await fetch('/api/v1/ai/config');
    if (res.ok) setConfig(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchConfig(); }, []);

  // ── Save personal key ─────────────────────────────────────
  const savePersonalKey = async () => {
    if (!personalKey.trim()) return;
    setPersonalSaving(true);
    setPersonalMsg(null);
    const res = await fetch('/api/v1/ai/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: personalProvider, apiKey: personalKey.trim() })
    });
    if (res.ok) {
      setPersonalMsg({ type: 'success', text: 'Personal AI key saved! Your notes will now use this key.' });
      setPersonalKey('');
      fetchConfig();
    } else {
      const d = await res.json();
      setPersonalMsg({ type: 'error', text: d.message || 'Failed to save key' });
    }
    setPersonalSaving(false);
  };

  // ── Remove personal key ────────────────────────────────────
  const removePersonalKey = async () => {
    await fetch('/api/v1/ai/config', { method: 'DELETE' });
    setPersonalMsg({ type: 'success', text: 'Personal key removed. Falling back to institution key.' });
    fetchConfig();
  };

  // ── Save institution key ───────────────────────────────────
  const saveInstKey = async () => {
    if (!instKey.trim()) return;
    setInstSaving(true);
    setInstMsg(null);
    const res = await fetch('/api/v1/ai/institution-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: instProvider, apiKey: instKey.trim() })
    });
    if (res.ok) {
      setInstMsg({ type: 'success', text: 'Institution AI key saved. All users can now use AI features.' });
      setInstKey('');
    } else {
      const d = await res.json();
      setInstMsg({ type: 'error', text: d.message || 'Failed to save key' });
    }
    setInstSaving(false);
  };

  // ── Remove institution key ─────────────────────────────────
  const removeInstKey = async () => {
    await fetch('/api/v1/ai/institution-config', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: instProvider })
    });
    setInstMsg({ type: 'success', text: 'Institution AI key removed.' });
  };

  const PROVIDERS = [
    { value: 'gemini', label: 'Google Gemini', logo: '🌟', hint: 'Get your key from aistudio.google.com (free tier available)' },
    { value: 'openai', label: 'OpenAI (ChatGPT)', logo: '🤖', hint: 'Get your key from platform.openai.com (requires credits)' },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />AI Settings
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure AI API keys to power AI Notes and other AI features</p>
      </div>

      {/* Current Status */}
      {loading ? (
        <Card><CardContent className="p-6 flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-teal-600" /><span className="text-sm text-gray-500">Loading configuration...</span></CardContent></Card>
      ) : (
        <Card className={`border-2 ${config?.configured ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
          <CardContent className="p-4 flex items-center gap-3">
            {config?.configured
              ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              : <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />}
            <div>
              {config?.configured ? (
                <>
                  <p className="font-semibold text-green-800 text-sm">AI is configured and ready</p>
                  <p className="text-xs text-green-600">
                    Using <strong className="capitalize">{config.provider}</strong> API •
                    Source: <Badge variant="outline" className="text-[10px] ml-1 py-0 capitalize">{config.scope === 'personal' ? '👤 Your personal key' : '🏛️ Institution key'}</Badge>
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-amber-800 text-sm">No AI key configured</p>
                  <p className="text-xs text-amber-600">Configure your personal key below, or ask your admin to set an institution-wide key</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Priority Explanation ── */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700 space-y-1">
              <p className="font-semibold">Key Priority (highest to lowest)</p>
              <p>1. 👤 Your personal key (overrides everything)</p>
              <p>2. 🏛️ Institution key (set by admin — shared by all)</p>
              <p>3. ❌ No key → AI features will show an error</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Personal Key Section ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-teal-600" />Your Personal AI Key
            <Badge variant="outline" className="text-[10px] ml-auto">Optional — overrides institution key</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {PROVIDERS.map(p => (
              <button
                key={p.value}
                onClick={() => setPersonalProvider(p.value as any)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-colors ${personalProvider === p.value ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                <span>{p.logo}</span>{p.label}
              </button>
            ))}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">
              {PROVIDERS.find(p => p.value === personalProvider)?.hint}
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Paste your API key here..."
                value={personalKey}
                onChange={e => setPersonalKey(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={savePersonalKey} disabled={!personalKey.trim() || personalSaving} className="bg-teal-600 hover:bg-teal-700 text-white">
                {personalSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {config?.configured && config.scope === 'personal' && (
            <Button variant="outline" size="sm" onClick={removePersonalKey} className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5 mr-1" />Remove my personal key
            </Button>
          )}

          {personalMsg && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${personalMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {personalMsg.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {personalMsg.text}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Institution Key Section (Admin Only) ── */}
      {showInstitutionSection && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-600" />Institution-Wide AI Key
              <Badge className="text-[10px] ml-auto bg-purple-100 text-purple-700">Admin Only — shared by all users</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-gray-500">This key will be used by ALL teachers and students in your institution who haven't set their own personal key.</p>

            <div className="flex gap-2">
              {PROVIDERS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setInstProvider(p.value as any)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-colors ${instProvider === p.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  <span>{p.logo}</span>{p.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Paste institution API key..."
                value={instKey}
                onChange={e => setInstKey(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={saveInstKey} disabled={!instKey.trim() || instSaving} className="bg-purple-600 hover:bg-purple-700 text-white">
                {instSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={removeInstKey} className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5 mr-1" />Remove institution key
            </Button>

            {instMsg && (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${instMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {instMsg.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {instMsg.text}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
