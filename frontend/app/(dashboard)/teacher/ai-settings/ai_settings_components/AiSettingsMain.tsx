'use client';
import { useAiSettings } from '../ai_settings_hooks/useAiSettings';
import { AiSettingsHeader } from './AiSettingsHeader';
import { AiSettingsStatus } from './AiSettingsStatus';
import { AiSettingsPersonalKey } from './AiSettingsPersonalKey';

export function AiSettingsMain() {
  const {
    config,
    loading,
    personalProvider,
    setPersonalProvider,
    personalKey,
    setPersonalKey,
    personalSaving,
    personalMsg,
    savePersonalKey,
    removePersonalKey
  } = useAiSettings();

  return (
    <div className="space-y-6 max-w-2xl">
      <AiSettingsHeader />
      <AiSettingsStatus config={config} loading={loading} />
      <AiSettingsPersonalKey
        config={config}
        personalProvider={personalProvider}
        setPersonalProvider={setPersonalProvider}
        personalKey={personalKey}
        setPersonalKey={setPersonalKey}
        personalSaving={personalSaving}
        personalMsg={personalMsg}
        savePersonalKey={savePersonalKey}
        removePersonalKey={removePersonalKey}
      />
    </div>
  );
}
