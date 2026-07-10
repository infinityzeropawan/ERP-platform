import axios from 'axios';
import twilio from 'twilio';
import prisma from '../config/db';
import { decrypt } from '../utils/encryption';

interface SMSConfig {
  apiKey: string;
  senderId?: string;  // MSG91 sender ID
  accountSid?: string; // Twilio Account SID
  authToken?: string;  // Twilio Auth Token
  fromNumber?: string; // Twilio from number
}

interface WhatsAppConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string; // e.g. whatsapp:+14155238886
}

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

async function logNotification(
  institutionId: string,
  channel: string,
  recipient: string,
  message: string,
  provider: string,
  status: 'sent' | 'failed',
  errorMessage?: string
) {
  await prisma.notificationLog.create({
    data: { institutionId, channel, recipient, message, provider, status, errorMessage },
  });
}

// =====================
//  SMS — MSG91
// =====================
async function sendViaMsg91(phone: string, message: string, config: SMSConfig): Promise<void> {
  const formattedPhone = phone.replace(/\D/g, ''); // strip non-digits
  const response = await axios.post(
    'https://api.msg91.com/api/v2/sendsms',
    {
      sender: config.senderId || 'BLDRNX',
      route: '4', // transactional
      country: '91',
      sms: [{ message, to: [formattedPhone] }],
    },
    { headers: { authkey: config.apiKey, 'Content-Type': 'application/json' } }
  );
  if (response.data?.type === 'error') {
    throw new Error(response.data.message || 'MSG91 error');
  }
}

// =====================
//  SMS — Twilio
// =====================
async function sendViaTwilio(phone: string, message: string, config: SMSConfig): Promise<void> {
  if (!config.accountSid || !config.authToken || !config.fromNumber) {
    throw new Error('Incomplete Twilio SMS configuration');
  }
  const client = twilio(config.accountSid, config.authToken);
  await client.messages.create({ body: message, from: config.fromNumber, to: phone });
}

// =====================
//  WhatsApp — Twilio
// =====================
async function sendWhatsAppViaTwilio(phone: string, message: string, config: WhatsAppConfig): Promise<void> {
  const client = twilio(config.accountSid, config.authToken);
  const toNumber = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
  await client.messages.create({ body: message, from: config.fromNumber, to: toNumber });
}

// =====================
//  Public API
// =====================
export async function sendSMS(institutionId: string, phone: string, message: string): Promise<void> {
  // Try MSG91 first, then Twilio
  const msg91Config = await getDecryptedConfig(institutionId, 'sms_msg91');
  if (msg91Config) {
    try {
      await sendViaMsg91(phone, message, msg91Config as unknown as SMSConfig);
      await logNotification(institutionId, 'sms', phone, message, 'msg91', 'sent');
      return;
    } catch (err: any) {
      await logNotification(institutionId, 'sms', phone, message, 'msg91', 'failed', err.message);
    }
  }
  const twilioConfig = await getDecryptedConfig(institutionId, 'sms_twilio');
  if (twilioConfig) {
    try {
      await sendViaTwilio(phone, message, twilioConfig as unknown as SMSConfig);
      await logNotification(institutionId, 'sms', phone, message, 'twilio', 'sent');
      return;
    } catch (err: any) {
      await logNotification(institutionId, 'sms', phone, message, 'twilio', 'failed', err.message);
      throw err;
    }
  }
  throw new Error('No SMS provider configured for this institution');
}

export async function sendWhatsApp(institutionId: string, phone: string, message: string): Promise<void> {
  const config = await getDecryptedConfig(institutionId, 'whatsapp_twilio');
  if (!config) throw new Error('No WhatsApp provider configured for this institution');
  try {
    await sendWhatsAppViaTwilio(phone, message, config as unknown as WhatsAppConfig);
    await logNotification(institutionId, 'whatsapp', phone, message, 'twilio_wa', 'sent');
  } catch (err: any) {
    await logNotification(institutionId, 'whatsapp', phone, message, 'twilio_wa', 'failed', err.message);
    throw err;
  }
}

/**
 * Broadcast SMS to all users in an institution matching a role filter.
 * Returns a summary { total, sent, failed }.
 */
export async function broadcastSMS(
  institutionId: string,
  message: string,
  roles: string[] = ['student', 'parent', 'teacher']
): Promise<{ total: number; sent: number; failed: number }> {
  const users = await prisma.user.findMany({
    where: { institutionId, role: { in: roles as any[] }, phone: { not: null } },
    select: { phone: true },
  });
  let sent = 0, failed = 0;
  for (const user of users) {
    if (!user.phone) continue;
    try {
      await sendSMS(institutionId, user.phone, message);
      sent++;
    } catch {
      failed++;
    }
  }
  return { total: users.length, sent, failed };
}
