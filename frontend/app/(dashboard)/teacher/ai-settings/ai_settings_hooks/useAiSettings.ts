import { useState, useEffect } from 'react';
import { AiConfig, AiSettingsMsg } from '../ai_settings_types';

export function useAiSettings() {
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Personal key form
  const [personalProvider, setPersonalProvider] = useState<'gemini' | 'openai'>('gemini');
  const [personalKey, setPersonalKey] = useState('');
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalMsg, setPersonalMsg] = useState<AiSettingsMsg | null>(null);

  // Institution key form (admin only)
  const [instProvider, setInstProvider] = useState<'gemini' | 'openai'>('gemini');
  const [instKey, setInstKey] = useState('');
  const [instSaving, setInstSaving] = useState(false);
  const [instMsg, setInstMsg] = useState<AiSettingsMsg | null>(null);

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

  return {
    config,
    loading,
    personalProvider,
    setPersonalProvider,
    personalKey,
    setPersonalKey,
    personalSaving,
    personalMsg,
    savePersonalKey,
    removePersonalKey,
    instProvider,
    setInstProvider,
    instKey,
    setInstKey,
    instSaving,
    instMsg,
    saveInstKey,
    removeInstKey,
  };
}
