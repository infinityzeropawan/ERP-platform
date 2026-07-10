import { Router, type Response } from 'express';
import prisma from '../config/db';
import { authenticateToken, type AuthenticatedRequest, requireRole } from '../middlewares/auth';
import { sendSMS, sendWhatsApp, broadcastSMS } from '../services/notificationService';

const router = Router();

// =====================
//  POST — Send broadcast SMS/WhatsApp
//  Admin only
// =====================
router.post(
  '/send',
  authenticateToken,
  requireRole(['school_admin', 'superadmin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const institutionId = req.user?.institutionId;
    if (!institutionId) return res.status(403).json({ error: 'Forbidden' });

    const { channel, roles, message, phone } = req.body as {
      channel: 'sms' | 'whatsapp';
      roles?: string[];
      message: string;
      phone?: string; // Optional: specific phone for single send
    };

    if (!message || message.trim().length < 5) {
      return res.status(400).json({ error: 'Message is too short (min 5 chars)' });
    }
    if (!channel || !['sms', 'whatsapp'].includes(channel)) {
      return res.status(400).json({ error: 'channel must be sms or whatsapp' });
    }

    // Single send
    if (phone) {
      try {
        if (channel === 'sms') await sendSMS(institutionId, phone, message);
        else await sendWhatsApp(institutionId, phone, message);
        return res.json({ message: 'Sent successfully', to: phone });
      } catch (err: any) {
        return res.status(500).json({ error: 'Send failed', message: err.message });
      }
    }

    // Broadcast
    const targetRoles = roles?.length ? roles : ['student', 'parent', 'teacher'];
    if (channel === 'whatsapp') {
      // WhatsApp broadcast — individual sends
      const users = await prisma.user.findMany({
        where: { institutionId, role: { in: targetRoles as any[] }, phone: { not: null } },
        select: { phone: true },
      });
      let sent = 0, failed = 0;
      for (const u of users) {
        if (!u.phone) continue;
        try {
          await sendWhatsApp(institutionId, u.phone, message);
          sent++;
        } catch {
          failed++;
        }
      }
      return res.json({ total: users.length, sent, failed });
    }

    const result = await broadcastSMS(institutionId, message, targetRoles);
    return res.json(result);
  }
);

// =====================
//  GET — Notification logs
//  Admin only
// =====================
router.get(
  '/logs',
  authenticateToken,
  requireRole(['school_admin', 'superadmin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const institutionId = req.user?.institutionId;
    if (!institutionId) return res.status(403).json({ error: 'Forbidden' });

    const { channel, status, page = '1', limit = '50' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = { institutionId };
    if (channel) where.channel = channel;
    if (status) where.status = status;

    const [logs, total] = await Promise.all([
      prisma.notificationLog.findMany({
        where,
        orderBy: { sentAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.notificationLog.count({ where }),
    ]);
    return res.json({ data: logs, total, page: parseInt(page) });
  }
);

export default router;
