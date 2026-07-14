import { Router, type Response } from 'express';
import prisma from '../config/db';
import { type AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// 1. Register a face descriptor for the logged in user
router.post('/register', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const institutionId = req.institutionId;
  const { descriptor } = req.body;

  if (!userId || !institutionId) {
    return res.status(400).json({ error: 'ContextMissing', message: 'User or institution context missing.' });
  }
  if (!Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ error: 'ValidationError', message: 'Invalid face descriptor. Must be an array of 128 floats.' });
  }

  try {
    const saved = await prisma.faceDescriptor.upsert({
      where: { userId },
      update: { descriptor },
      create: { userId, institutionId, descriptor },
    });
    return res.status(200).json(saved);
  } catch (error: any) {
    console.error('Face register exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 2. Get the current user's face descriptor
router.get('/descriptor', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ error: 'ContextMissing', message: 'User context missing.' });
  }

  try {
    const desc = await prisma.faceDescriptor.findUnique({
      where: { userId },
    });
    if (!desc) {
      return res.status(404).json({ error: 'NotFound', message: 'No face descriptor registered.' });
    }
    return res.status(200).json(desc);
  } catch (error: any) {
    console.error('Fetch face descriptor exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 3. Submit face attendance
router.post('/attend', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const institutionId = req.institutionId;
  const { confidenceScore, latitude, longitude } = req.body;

  if (!userId || !institutionId) {
    return res.status(400).json({ error: 'ContextMissing', message: 'User or institution context missing.' });
  }
  if (confidenceScore === undefined) {
    return res.status(400).json({ error: 'ValidationError', message: 'confidenceScore is required.' });
  }

  try {
    const inst = await prisma.institution.findUnique({ where: { id: institutionId } });
    if (!inst) {
      return res.status(404).json({ error: 'NotFound', message: 'Institution not found.' });
    }

    let verified = false;
    // Simple geofencing calculation if institution has coordinates
    if (inst.latitude && inst.longitude && latitude && longitude) {
      // Haversine formula to get distance in meters
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371e3; // Earth radius in meters
      const dLat = toRad(latitude - inst.latitude);
      const dLon = toRad(longitude - inst.longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(inst.latitude)) * Math.cos(toRad(latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      if (distance <= (inst.geofenceRadius || 500)) {
        verified = true;
      }
    } else {
      // If no institution coordinates or no provided coordinates, we might just assume true or false depending on policy.
      // Let's assume true if institution has no geofence set, but false if geofence is set and user gave no coords.
      if (!inst.latitude || !inst.longitude) {
        verified = true; // No geofence enforced
      }
    }

    const log = await prisma.faceAttendanceLog.create({
      data: {
        userId,
        institutionId,
        date: new Date(),
        status: 'present',
        confidenceScore,
        latitude,
        longitude,
        verified,
      }
    });

    return res.status(201).json(log);
  } catch (error: any) {
    console.error('Face attend exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 4. Get face attendance logs (Admin)
router.get('/logs', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const dateStr = req.query.date as string;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'Institution context missing.' });
  }

  try {
    let dateFilter = {};
    if (dateStr) {
      const start = new Date(dateStr);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateStr);
      end.setHours(23, 59, 59, 999);
      dateFilter = { date: { gte: start, lte: end } };
    }

    const logs = await prisma.faceAttendanceLog.findMany({
      where: {
        institutionId,
        ...dateFilter
      },
      include: {
        user: { select: { name: true, role: true, email: true } }
      },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(logs);
  } catch (error: any) {
    console.error('Fetch face logs exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

export default router;
