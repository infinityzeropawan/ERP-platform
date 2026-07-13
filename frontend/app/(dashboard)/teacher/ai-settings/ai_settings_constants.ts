import { AiProvider } from './ai_settings_types';

export const AI_PROVIDERS: AiProvider[] = [
  { value: 'gemini', label: 'Google Gemini', logo: '🌟', hint: 'Get your key from aistudio.google.com (free tier available)' },
  { value: 'openai', label: 'OpenAI (ChatGPT)', logo: '🤖', hint: 'Get your key from platform.openai.com (requires credits)' },
];
