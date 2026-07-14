import { Router, type Response } from 'express';
import prisma from '../config/db';
import { type AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// 1. Post current location (Driver)
router.post('/location', async (req: AuthenticatedRequest, res: Response) => {
  const driverId = req.user?.id;
  const institutionId = req.institutionId;
  const { latitude, longitude, accuracy, speed, heading } = req.body;

  if (!driverId || !institutionId) {
    return res.status(400).json({ error: 'ContextMissing', message: 'User or institution context missing.' });
  }
  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'ValidationError', message: 'latitude and longitude are required.' });
  }

  try {
    const loc = await prisma.busLocation.create({
      data: {
        driverId,
        institutionId,
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        timestamp: new Date()
      }
    });
    return res.status(201).json(loc);
  } catch (error: any) {
    console.error('Post bus location exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 2. Get latest locations of all active buses (Admin)
router.get('/locations', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'Institution context missing.' });
  }

  try {
    // Get latest location per driver in the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    
    // In PostgreSQL, to get the latest per group we could use DISTINCT ON, 
    // but Prisma doesn't support it natively yet. We can fetch recent ones and group in JS.
    const recentLocations = await prisma.busLocation.findMany({
      where: {
        institutionId,
        timestamp: { gte: twoHoursAgo }
      },
      orderBy: { timestamp: 'desc' },
      include: {
        driver: { select: { name: true, busNumber: true, phone: true } }
      }
    });

    // Group by driverId and take the first (latest) one
    const latestMap = new Map<string, any>();
    for (const loc of recentLocations) {
      if (!latestMap.has(loc.driverId)) {
        latestMap.set(loc.driverId, loc);
      }
    }

    return res.status(200).json(Array.from(latestMap.values()));
  } catch (error: any) {
    console.error('Fetch bus locations exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 3. Get location history for a specific driver (Admin)
router.get('/history/:driverId', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { driverId } = req.params;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'Institution context missing.' });
  }

  try {
    // Get last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const history = await prisma.busLocation.findMany({
      where: {
        institutionId,
        driverId,
        timestamp: { gte: oneDayAgo }
      },
      orderBy: { timestamp: 'asc' } // chronological for drawing paths
    });

    return res.status(200).json(history);
  } catch (error: any) {
    console.error('Fetch bus history exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

export default router;
