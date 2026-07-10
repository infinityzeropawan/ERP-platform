import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import prisma from '../config/db';
import { authenticateToken, type AuthenticatedRequest, requireRole } from '../middlewares/auth';
import { decrypt } from '../utils/encryption';

const router = Router();

async function getDecryptedConfig(institutionId: string, provider: string): Promise<Record<string, string> | null> {
  const config = await prisma.integrationConfig.findUnique({
    where: { institutionId_provider: { institutionId, provider } },
  });
  if (!config || !config.isActive) return null;
  try {
    return JSON.parse(decrypt(config.encryptedData));
  } catch {
    return null;
  }
}

// =====================
//  POST — Create payment order (Razorpay or Stripe)
// =====================
router.post(
  '/create-order',
  authenticateToken,
  requireRole(['student', 'parent', 'school_admin', 'superadmin']),
  async (req: AuthenticatedRequest, res: Response) => {
    const institutionId = req.user?.institutionId;
    const studentId = req.user?.id;
    if (!institutionId) return res.status(403).json({ error: 'Forbidden' });

    const { feeRecordId, amount, currency = 'INR', gateway } = req.body as {
      feeRecordId: string;
      amount: number;
      currency?: string;
      gateway: 'razorpay' | 'stripe';
    };

    if (!feeRecordId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'feeRecordId and amount are required' });
    }
    if (!['razorpay', 'stripe'].includes(gateway)) {
      return res.status(400).json({ error: 'gateway must be razorpay or stripe' });
    }

    try {
      if (gateway === 'razorpay') {
        const config = await getDecryptedConfig(institutionId, 'razorpay');
        if (!config) return res.status(400).json({ error: 'Razorpay not configured for this institution' });

        const razorpay = new Razorpay({ key_id: config.keyId, key_secret: config.keySecret });
        const order = await razorpay.orders.create({
          amount: Math.round(amount * 100), // paise
          currency,
          receipt: `fee_${feeRecordId}`,
          notes: { institutionId, studentId: studentId!, feeRecordId },
        });

        const record = await prisma.paymentRecord.create({
          data: {
            institutionId,
            studentId: studentId!,
            feeRecordId,
            gateway: 'razorpay',
            gatewayOrderId: order.id,
            amount,
            currency,
            status: 'created',
          },
        });
        return res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: config.keyId,           // public key is safe to send
          paymentRecordId: record.id,
        });
      }

      // Stripe
      const config = await getDecryptedConfig(institutionId, 'stripe');
      if (!config) return res.status(400).json({ error: 'Stripe not configured for this institution' });

      const stripe = new Stripe(config.secretKey, { apiVersion: '2026-06-24.dahlia' });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata: { institutionId, studentId: studentId!, feeRecordId },
      });

      const record = await prisma.paymentRecord.create({
        data: {
          institutionId,
          studentId: studentId!,
          feeRecordId,
          gateway: 'stripe',
          gatewayOrderId: paymentIntent.id,
          amount,
          currency,
          status: 'created',
        },
      });
      return res.json({
        clientSecret: paymentIntent.client_secret,
        publishableKey: config.publishableKey,
        paymentRecordId: record.id,
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Order creation failed', message: err.message });
    }
  }
);

// =====================
//  POST — Razorpay Webhook (HMAC signature verified)
// =====================
router.post('/webhook/razorpay', async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const rawBody = JSON.stringify(req.body);

  // Webhooks have no institutionId — find order by gatewayOrderId
  const event = req.body;
  if (!event?.payload?.payment?.entity) {
    return res.status(200).json({ received: true });
  }

  const entity = event.payload.payment.entity;
  const orderId: string = entity.order_id;

  // Find the payment record to get institutionId
  const paymentRecord = await prisma.paymentRecord.findFirst({ where: { gatewayOrderId: orderId } });
  if (!paymentRecord) return res.status(200).json({ received: true });

  // Get webhook secret for this institution
  const config = await getDecryptedConfig(paymentRecord.institutionId, 'razorpay');
  if (!config?.webhookSecret) {
    // Accept but don't mark verified
    return res.status(200).json({ received: true });
  }

  // Verify HMAC
  const expectedSig = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSig !== signature) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  // Process event
  if (event.event === 'payment.captured') {
    await prisma.paymentRecord.updateMany({
      where: { gatewayOrderId: orderId },
      data: { status: 'paid', webhookVerified: true },
    });
    if (paymentRecord.feeRecordId) {
      await prisma.feeRecord.update({
        where: { id: paymentRecord.feeRecordId },
        data: { paidDate: new Date(), status: 'paid' },
      });
    }
  } else if (event.event === 'payment.failed') {
    await prisma.paymentRecord.updateMany({
      where: { gatewayOrderId: orderId },
      data: { status: 'failed', webhookVerified: true },
    });
  }
  return res.json({ received: true });
});

// =====================
//  POST — Stripe Webhook (Stripe-Signature verified)
// =====================
router.post('/webhook/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const rawBody = req.body as Buffer;

  // We need institutionId from the metadata — decode payload first
  let event: Stripe.Event;
  try {
    // We'll decode without verification first to get institutionId, then reverify
    const decoded = JSON.parse(rawBody.toString());
    const pi = decoded?.data?.object as Stripe.PaymentIntent;
    const institutionId = pi?.metadata?.institutionId;
    if (!institutionId) return res.status(200).json({ received: true });

    const config = await getDecryptedConfig(institutionId, 'stripe');
    if (!config?.webhookSecret) return res.status(200).json({ received: true });

    const stripe = new Stripe(config.secretKey, { apiVersion: '2026-06-24.dahlia' });
    event = stripe.webhooks.constructEvent(rawBody, sig, config.webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const pi2 = event.data.object as Stripe.PaymentIntent;
      await prisma.paymentRecord.updateMany({
        where: { gatewayOrderId: pi2.id },
        data: { status: 'paid', webhookVerified: true },
      });
      const record = await prisma.paymentRecord.findFirst({ where: { gatewayOrderId: pi2.id } });
      if (record?.feeRecordId) {
        await prisma.feeRecord.update({
          where: { id: record.feeRecordId },
          data: { paidDate: new Date(), status: 'paid' },
        });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi2 = event.data.object as Stripe.PaymentIntent;
      await prisma.paymentRecord.updateMany({
        where: { gatewayOrderId: pi2.id },
        data: { status: 'failed', webhookVerified: true },
      });
    }
    return res.json({ received: true });
  } catch (err: any) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
});

// =====================
//  GET — Payment history (student or admin)
// =====================
router.get(
  '/history',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const institutionId = req.user?.institutionId;
    const role = req.user?.role;
    const userId = req.user?.id;
    if (!institutionId) return res.status(403).json({ error: 'Forbidden' });

    const where: any = { institutionId };
    if (role === 'student') where.studentId = userId;

    const records = await prisma.paymentRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return res.json(records);
  }
);

export default router;
