import { Router, type Response } from 'express';
import prisma from '../config/db';
import { authenticateToken, type AuthenticatedRequest, requireRole } from '../middlewares/auth';
import { encrypt, decrypt, maskKey } from '../utils/encryption';
import { sendSMS, sendWhatsApp } from '../services/notificationService';

const router = Router();

// All routes require admin or superadmin
router.use(authenticateToken, requireRole(['school_admin', 'superadmin']));

const VALID_PROVIDERS = ['sms_msg91', 'sms_twilio', 'whatsapp_twilio', 'razorpay', 'stripe'];

// =====================
//  GET — List all configured integrations (masked)
// =====================
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.user?.institutionId;
  if (!institutionId) return res.status(403).json({ error: 'Forbidden' });

  const configs = await prisma.integrationConfig.findMany({ where: { institutionId } });

  // Return masked versions only — NEVER the raw encrypted data or decrypted keys
  const masked = configs.map((c) => {
    let preview: Record<string, string> = {};
    try {
      const decrypted = JSON.parse(decrypt(c.encryptedData));
      // Mask every value
      for (const [k, v] of Object.entries(decrypted)) {
        preview[k] = maskKey(String(v));
      }
    } catch {
      preview = {};
    }
    return {
      id: c.id,
      provider: c.provider,
      isActive: c.isActive,
      updatedAt: c.updatedAt,
      config: preview,
    };
  });
  return res.json(masked);
});

// =====================
//  POST — Save / update a provider config
// =====================
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.user?.institutionId;
  if (!institutionId) return res.status(403).json({ error: 'Forbidden' });

  const { provider, config, isActive } = req.body as {
    provider: string;
    config: Record<string, string>;
    isActive?: boolean;
  };

  if (!VALID_PROVIDERS.includes(provider)) {
    return res.status(400).json({ error: 'Invalid provider', validProviders: VALID_PROVIDERS });
  }
  if (!config || typeof config !== 'object') {
    return res.status(400).json({ error: 'config object is required' });
  }

  // Encrypt the entire config object
  const encryptedData = encrypt(JSON.stringify(config));

  const saved = await prisma.integrationConfig.upsert({
    where: { institutionId_provider: { institutionId, provider } },
    create: { institutionId, provider, encryptedData, isActive: isActive ?? true },
    update: { encryptedData, isActive: isActive ?? true },
  });

  return res.json({ message: 'Integration saved successfully', id: saved.id, provider: saved.provider });
});

// =====================
//  POST — Test a provider (sends to admin's own phone)
// =====================
router.post('/test', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.user?.institutionId;
  const adminId = req.user?.id;
  if (!institutionId || !adminId) return res.status(403).json({ error: 'Forbidden' });

  const { provider } = req.body as { provider: string };
  if (!VALID_PROVIDERS.includes(provider)) {
    return res.status(400).json({ error: 'Invalid provider' });
  }

  // Get admin's phone
  const admin = await prisma.user.findUnique({ where: { id: adminId }, select: { phone: true, name: true } });
  if (!admin?.phone) {
    return res.status(400).json({ error: 'No phone number on your account. Update your profile first.' });
  }

  const testMsg = `[Buildroonix Test] SMS/WhatsApp integration is working correctly! -${admin.name}`;

  try {
    if (provider.startsWith('sms_')) {
      await sendSMS(institutionId, admin.phone, testMsg);
    } else if (provider === 'whatsapp_twilio') {
      await sendWhatsApp(institutionId, admin.phone, testMsg);
    } else if (provider === 'razorpay' || provider === 'stripe') {
      // For payment gateways, just verify the config can be decrypted
      const config = await prisma.integrationConfig.findUnique({
        where: { institutionId_provider: { institutionId, provider } },
      });
      if (!config) return res.status(404).json({ error: 'Provider not configured yet' });
      JSON.parse(decrypt(config.encryptedData)); // throws if corrupt
      return res.json({ message: 'Payment config verified successfully' });
    }
    return res.json({ message: `Test ${provider} notification sent to ${maskKey(admin.phone)}` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Test failed', message: err.message });
  }
});

// =====================
//  PATCH — Toggle active status
// =====================
router.patch('/:provider/toggle', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.user?.institutionId;
  if (!institutionId) return res.status(403).json({ error: 'Forbidden' });
  const { provider } = req.params;

  const config = await prisma.integrationConfig.findUnique({
    where: { institutionId_provider: { institutionId, provider } },
  });
  if (!config) return res.status(404).json({ error: 'Provider not configured' });

  const updated = await prisma.integrationConfig.update({
    where: { institutionId_provider: { institutionId, provider } },
    data: { isActive: !config.isActive },
  });
  return res.json({ provider, isActive: updated.isActive });
});

// =====================
//  DELETE — Remove a provider config
// =====================
router.delete('/:provider', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.user?.institutionId;
  if (!institutionId) return res.status(403).json({ error: 'Forbidden' });
  const { provider } = req.params;

  await prisma.integrationConfig.deleteMany({ where: { institutionId, provider } });
  return res.json({ message: `${provider} integration removed` });
});

export default router;
