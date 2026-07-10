'use client';
import React, { useEffect, useState } from 'react';
import { Shield, MessageSquare, CreditCard, Send, CheckCircle, XCircle, Loader2, Eye, EyeOff, Trash2, ToggleLeft, ToggleRight, Bell } from 'lucide-react';

type Provider = 'sms_msg91' | 'sms_twilio' | 'whatsapp_twilio' | 'razorpay' | 'stripe';

const PROVIDER_META: Record<Provider, { label: string; icon: string; color: string; fields: { key: string; label: string; placeholder: string; type?: string }[] }> = {
  sms_msg91: {
    label: 'MSG91 (SMS - India)', icon: '📱', color: 'blue',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'Your MSG91 Auth Key' },
      { key: 'senderId', label: 'Sender ID', placeholder: 'e.g. BLDRNX (6 chars)' },
    ],
  },
  sms_twilio: {
    label: 'Twilio (SMS - International)', icon: '📲', color: 'red',
    fields: [
      { key: 'accountSid', label: 'Account SID', placeholder: 'ACxxxxxxxxxxxxxxxx' },
      { key: 'authToken', label: 'Auth Token', placeholder: 'Twilio Auth Token' },
      { key: 'fromNumber', label: 'From Number', placeholder: '+1xxxxxxxxxx' },
    ],
  },
  whatsapp_twilio: {
    label: 'WhatsApp via Twilio', icon: '💬', color: 'green',
    fields: [
      { key: 'accountSid', label: 'Account SID', placeholder: 'ACxxxxxxxxxxxxxxxx' },
      { key: 'authToken', label: 'Auth Token', placeholder: 'Twilio Auth Token' },
      { key: 'fromNumber', label: 'WhatsApp From', placeholder: 'whatsapp:+14155238886' },
    ],
  },
  razorpay: {
    label: 'Razorpay (India)', icon: '💳', color: 'blue',
    fields: [
      { key: 'keyId', label: 'Key ID', placeholder: 'rzp_live_xxxxxxx' },
      { key: 'keySecret', label: 'Key Secret', placeholder: 'Your Razorpay Secret' },
      { key: 'webhookSecret', label: 'Webhook Secret', placeholder: 'From Razorpay dashboard' },
    ],
  },
  stripe: {
    label: 'Stripe (International)', icon: '💰', color: 'purple',
    fields: [
      { key: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_live_xxxxxxx' },
      { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_xxxxxxx' },
      { key: 'webhookSecret', label: 'Webhook Secret', placeholder: 'whsec_xxxxxxx' },
    ],
  },
};

interface ConfiguredProvider {
  id: string;
  provider: Provider;
  isActive: boolean;
  updatedAt: string;
  config: Record<string, string>;
}

export default function IntegrationsPage() {
  const [configured, setConfigured] = useState<ConfiguredProvider[]>([]);
  const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp' | 'payment'>('sms');
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState<Provider | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const load = async () => {
    const r = await fetch('/api/v1/admin/integrations');
    if (r.ok) setConfigured(await r.json());
  };

  useEffect(() => { load(); }, []);

  const getConfigured = (p: Provider) => configured.find(c => c.provider === p);

  const openEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setFormValues({});
    setShowValues({});
  };

  const saveConfig = async () => {
    if (!editingProvider) return;
    const requiredFields = PROVIDER_META[editingProvider].fields.map(f => f.key);
    const missing = requiredFields.filter(k => !formValues[k]?.trim());
    if (missing.length > 0) { showToast('error', `Missing fields: ${missing.join(', ')}`); return; }

    setLoading(true);
    try {
      const r = await fetch('/api/v1/admin/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: editingProvider, config: formValues }),
      });
      if (!r.ok) throw new Error((await r.json()).error);
      showToast('success', `${PROVIDER_META[editingProvider].label} configured successfully!`);
      setEditingProvider(null);
      await load();
    } catch (e: any) { showToast('error', e.message); }
    finally { setLoading(false); }
  };

  const testProvider = async (provider: Provider) => {
    setTestLoading(provider);
    try {
      const r = await fetch('/api/v1/admin/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || data.error);
      showToast('success', data.message);
    } catch (e: any) { showToast('error', e.message); }
    finally { setTestLoading(null); }
  };

  const toggleProvider = async (provider: Provider) => {
    const r = await fetch(`/api/v1/admin/integrations/${provider}/toggle`, { method: 'PATCH' });
    if (r.ok) { showToast('success', 'Status updated'); await load(); }
  };

  const deleteProvider = async (provider: Provider) => {
    if (!confirm(`Remove ${PROVIDER_META[provider].label} configuration? This cannot be undone.`)) return;
    const r = await fetch(`/api/v1/admin/integrations/${provider}`, { method: 'DELETE' });
    if (r.ok) { showToast('success', 'Integration removed'); await load(); }
  };

  const TABS = [
    { id: 'sms', label: 'SMS', icon: MessageSquare, providers: ['sms_msg91', 'sms_twilio'] as Provider[] },
    { id: 'whatsapp', label: 'WhatsApp', icon: Send, providers: ['whatsapp_twilio'] as Provider[] },
    { id: 'payment', label: 'Payments', icon: CreditCard, providers: ['razorpay', 'stripe'] as Provider[] },
  ];

  const currentProviders = TABS.find(t => t.id === activeTab)?.providers ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl text-white font-medium animate-fade-in ${toast.type === 'success' ? 'bg-teal-600' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="p-2 bg-indigo-100 rounded-xl"><Shield className="h-6 w-6 text-indigo-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations & APIs</h1>
          <p className="text-sm text-gray-500">Configure SMS, WhatsApp, and payment providers. Keys are AES-256 encrypted.</p>
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Shield className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-800">
          <strong>Security Notice:</strong> All API keys are encrypted with AES-256-GCM before storing. Keys are never displayed after saving — only masked previews are shown. Ensure your account is secured with a strong password.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <tab.icon className="h-4 w-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* Provider Cards */}
      <div className="space-y-4">
        {currentProviders.map(provider => {
          const meta = PROVIDER_META[provider];
          const cfg = getConfigured(provider);
          return (
            <div key={provider} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${cfg?.isActive ? 'border-teal-200' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meta.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{meta.label}</h3>
                    {cfg
                      ? <p className="text-xs text-teal-600 font-medium mt-0.5">✅ Configured — Updated {new Date(cfg.updatedAt).toLocaleDateString()}</p>
                      : <p className="text-xs text-gray-400 mt-0.5">Not configured</p>
                    }
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cfg && (
                    <>
                      <button onClick={() => testProvider(provider)} disabled={testLoading === provider}
                        className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1">
                        {testLoading === provider ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                        Test
                      </button>
                      <button onClick={() => toggleProvider(provider)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${cfg.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {cfg.isActive ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                        {cfg.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => deleteProvider(provider)}
                        className="text-xs px-2 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-all">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </>
                  )}
                  <button onClick={() => openEdit(provider)}
                    className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                    {cfg ? 'Update Keys' : 'Configure'}
                  </button>
                </div>
              </div>

              {/* Masked config preview */}
              {cfg && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {Object.entries(cfg.config).map(([k, v]) => (
                    <div key={k} className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                      <code className="text-xs font-mono text-gray-700">{v}</code>
                    </div>
                  ))}
                </div>
              )}

              {/* Webhook URL (for payment gateways) */}
              {cfg && (provider === 'razorpay' || provider === 'stripe') && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-700 mb-1">📋 Copy this Webhook URL into your {meta.label} Dashboard:</p>
                  <code className="text-xs text-blue-800 bg-white px-2 py-1 rounded border border-blue-200 block">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/api/v1/payments/webhook/{provider === 'razorpay' ? 'razorpay' : 'stripe'}
                  </code>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingProvider && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{PROVIDER_META[editingProvider].icon}</span>
                <div>
                  <h2 className="font-bold text-gray-900">Configure {PROVIDER_META[editingProvider].label}</h2>
                  <p className="text-xs text-gray-400">Keys are encrypted immediately and never stored in plaintext.</p>
                </div>
              </div>

              <div className="space-y-3">
                {PROVIDER_META[editingProvider].fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                    <div className="relative">
                      <input
                        type={showValues[field.key] ? 'text' : 'password'}
                        placeholder={field.placeholder}
                        value={formValues[field.key] || ''}
                        onChange={e => setFormValues(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                      />
                      <button onClick={() => setShowValues(p => ({ ...p, [field.key]: !p[field.key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showValues[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
                <p className="text-xs text-amber-700">⚠️ After saving, these keys cannot be viewed again — only masked previews will be shown.</p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setEditingProvider(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={saveConfig} disabled={loading}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                Encrypt & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
