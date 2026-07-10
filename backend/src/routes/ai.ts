import { Router, type Response } from 'express';
import prisma from '../config/db';
import { type AuthenticatedRequest } from '../middlewares/auth';
import { encrypt, decrypt } from '../utils/encryption';

const router = Router();

// ─── Helper: resolve AI key for the current user ────────────────────────────
// Priority: personal key → institution admin key → null
async function resolveAiKey(userId: string, institutionId: string): Promise<{
  provider: string; apiKey: string;
} | null> {
  // 1. Check personal key
  const personal = await prisma.userAiKey.findUnique({ where: { userId } });
  if (personal) {
    try {
      const decrypted = JSON.parse(decrypt(personal.encryptedKey)) as { apiKey: string };
      return { provider: personal.provider, apiKey: decrypted.apiKey };
    } catch { /* corrupted, fall through */ }
  }

  // 2. Check institution admin key (stored in IntegrationConfig)
  for (const provider of ['ai_gemini', 'ai_openai']) {
    const inst = await prisma.integrationConfig.findUnique({
      where: { institutionId_provider: { institutionId, provider } }
    });
    if (inst?.isActive) {
      try {
        const decrypted = JSON.parse(decrypt(inst.encryptedData)) as { apiKey: string };
        return { provider: provider.replace('ai_', ''), apiKey: decrypted.apiKey };
      } catch { /* corrupted, try next */ }
    }
  }

  return null;
}

// ─── GET /api/v1/ai/config — check if AI is configured ──────────────────────
router.get('/config', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const institutionId = req.institutionId!;

  // Personal key?
  const personal = await prisma.userAiKey.findUnique({ where: { userId } });
  if (personal) {
    return res.json({ configured: true, scope: 'personal', provider: personal.provider });
  }

  // Institution key?
  for (const provider of ['ai_gemini', 'ai_openai']) {
    const inst = await prisma.integrationConfig.findUnique({
      where: { institutionId_provider: { institutionId, provider } }
    });
    if (inst?.isActive) {
      return res.json({ configured: true, scope: 'institution', provider: provider.replace('ai_', '') });
    }
  }

  return res.json({ configured: false });
});

// ─── POST /api/v1/ai/config — save personal AI key ──────────────────────────
router.post('/config', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { provider, apiKey } = req.body;

  if (!provider || !apiKey) {
    return res.status(400).json({ error: 'provider and apiKey are required' });
  }
  if (!['gemini', 'openai'].includes(provider)) {
    return res.status(400).json({ error: 'provider must be gemini or openai' });
  }

  const encryptedKey = encrypt(JSON.stringify({ apiKey }));

  await prisma.userAiKey.upsert({
    where: { userId },
    create: { userId, provider, encryptedKey },
    update: { provider, encryptedKey }
  });

  return res.json({ message: 'AI key saved successfully', provider });
});

// ─── DELETE /api/v1/ai/config — remove personal AI key ──────────────────────
router.delete('/config', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  await prisma.userAiKey.deleteMany({ where: { userId } });
  return res.json({ message: 'AI key removed' });
});

// ─── POST /api/v1/ai/institution-config — admin saves institution-wide AI key
router.post('/institution-config', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const institutionId = req.institutionId!;
  const { provider, apiKey } = req.body;

  // Only admins can set institution-wide keys
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || !['school_admin', 'superadmin'].includes(user.role)) {
    return res.status(403).json({ error: 'Only admins can set institution-wide AI keys' });
  }

  if (!provider || !apiKey) {
    return res.status(400).json({ error: 'provider and apiKey are required' });
  }

  const dbProvider = `ai_${provider}`; // ai_gemini or ai_openai
  const encryptedData = encrypt(JSON.stringify({ apiKey }));

  await prisma.integrationConfig.upsert({
    where: { institutionId_provider: { institutionId, provider: dbProvider } },
    create: { institutionId, provider: dbProvider, encryptedData, isActive: true },
    update: { encryptedData, isActive: true }
  });

  return res.json({ message: `Institution AI key (${provider}) saved`, provider });
});

// ─── DELETE /api/v1/ai/institution-config — admin removes institution AI key
router.delete('/institution-config', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const institutionId = req.institutionId!;
  const { provider } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || !['school_admin', 'superadmin'].includes(user.role)) {
    return res.status(403).json({ error: 'Only admins can remove institution-wide AI keys' });
  }

  await prisma.integrationConfig.deleteMany({
    where: { institutionId, provider: `ai_${provider}` }
  });

  return res.json({ message: 'Institution AI key removed' });
});

// ─── POST /api/v1/ai/generate — generate AI content ─────────────────────────
router.post('/generate', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const institutionId = req.institutionId!;
  const { topic, subject, style = 'detailed' } = req.body;

  if (!topic) return res.status(400).json({ error: 'topic is required' });

  const keyInfo = await resolveAiKey(userId, institutionId);
  if (!keyInfo) {
    return res.status(402).json({
      error: 'NoAiKey',
      message: 'No AI key configured. Ask your institution admin to set one, or configure your own in AI Settings.'
    });
  }

  const prompt = `Generate ${style} study notes for the topic: "${topic}"${subject ? ` in the subject: "${subject}"` : ''}.

Format with:
- A clear H1 title
- H2 sections for major concepts
- Bullet points for key points
- Code examples where relevant (use markdown code blocks)
- A "Key Points for Exam" section at the end

Use markdown formatting throughout.`;

  try {
    let content = '';

    if (keyInfo.provider === 'gemini') {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(keyInfo.apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      content = result.response.text();

    } else if (keyInfo.provider === 'openai') {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: keyInfo.apiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      });
      content = completion.choices[0]?.message?.content || '';
    }

    if (!content) return res.status(500).json({ error: 'AI returned empty response' });

    return res.json({ content, provider: keyInfo.provider, topic, subject });

  } catch (err: any) {
    const msg = err?.message || 'AI generation failed';
    if (msg.includes('API_KEY_INVALID') || msg.includes('401') || msg.includes('invalid_api_key')) {
      return res.status(401).json({ error: 'InvalidApiKey', message: 'The configured AI API key is invalid. Please update it in AI Settings.' });
    }
    return res.status(500).json({ error: 'AiGenerationFailed', message: msg });
  }
});

export default router;
