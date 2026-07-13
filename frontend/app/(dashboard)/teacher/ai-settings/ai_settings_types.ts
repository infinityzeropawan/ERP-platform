export interface AiConfig {
  configured: boolean;
  scope?: 'personal' | 'institution';
  provider?: string;
}

export interface AiSettingsMsg {
  type: 'success' | 'error';
  text: string;
}

export interface AiProvider {
  value: 'gemini' | 'openai';
  label: string;
  logo: string;
  hint: string;
}
