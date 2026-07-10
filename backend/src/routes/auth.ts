import { Router, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import zxcvbn from 'zxcvbn';
import prisma from '../config/db';
import { type AuthenticatedRequest } from '../middlewares/auth';
import { type UserRole } from '@prisma/client';
import { env } from '../config/env';

const router = Router();
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
const createAccessToken = (user: {
  id: string; email: string; role: UserRole; institutionId: string | null;
  institution?: { slug: string } | null;
}) => jwt.sign({
  id: user.id,
  email: user.email,
  role: user.role,
  institutionId: user.institutionId,
  institutionSlug: user.institution?.slug || null,
}, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] });

async function createRefreshToken(userId: string) {
  const token = crypto.randomBytes(48).toString('base64url');
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
  return token;
}

const refreshCookie = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'strict' as const,
  path: '/api/v1/auth',
  maxAge: REFRESH_TOKEN_TTL_MS,
};

function presentedRefreshToken(req: AuthenticatedRequest) {
  const cookie = req.headers.cookie
    ?.split(';')
    .map(value => value.trim().split('='))
    .find(([name]) => name === 'buildroonix_refresh')?.[1];
  return cookie ? decodeURIComponent(cookie) : '';
}

router.post('/register', async (req: AuthenticatedRequest, res: Response) => {
  const {
    name, email, phone, dob, gender, fatherName, motherName,
    address, bloodGroup, class: className, password, institutionSlug
  } = req.body;

  if (!email || !password || !name || !institutionSlug) {
    return res.status(400).json({ error: 'ValidationError', message: 'Name, email, password, and institution code are required.' });
  }

  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 3) {
    return res.status(400).json({ 
      error: 'ValidationError', 
      message: passwordStrength.feedback.warning || 'Please choose a stronger password with at least 8 characters, including numbers and symbols.'
    });
  }

  try {
    // 1. Resolve institution by slug
    const institution = await prisma.institution.findUnique({
      where: { slug: institutionSlug }
    });

    if (!institution) {
      return res.status(404).json({ error: 'NotFound', message: 'Institution code is invalid.' });
    }

    // 2. Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(400).json({ error: 'EmailTaken', message: 'This email is already registered.' });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create pending student record
    const student = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        dob: dob ? new Date(dob) : null,
        gender,
        fatherName,
        motherName,
        address,
        bloodGroup,
        class: className || null,
        password: hashedPassword,
        role: 'student',
        isApproved: false, // REQUIRES ADMIN APPROVAL
        institutionId: institution.id,
        rollNo: 'TEMP-' + Math.floor(1000 + Math.random() * 9000)
      }
    });

    return res.status(201).json({ message: 'Registration submitted successfully. Pending admin approval.', userId: student.id });
  } catch (error: any) {
    console.error('Student registration exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

const loginLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute window
	max: process.env.NODE_ENV === 'production' ? 3 : 10000, // 3 attempts in production
	message: {
		error: 'TooManyRequests',
		message: 'Too many login attempts. Please wait 1 minute before trying again.',
	},
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: true, // Only count failed attempts
});

router.post('/login', loginLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'ValidationError', message: 'Email and password are required' });
  }

  try {
    // Check against active DB records
    const user = await prisma.user.findUnique({
      where: { email },
      include: { institution: { select: { slug: true } } }
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ error: 'Unauthorized', message: `Account exists, but is not registered as a ${role.replace('_', ' ')}.` });
    }

    // Enforce approval check
    if (user.isApproved === false) {
      return res.status(403).json({ error: 'PendingApproval', message: 'Your account is pending administrator approval.' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'InvalidCredentials', message: 'Incorrect email or password' });
    }

    const token = createAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);
    res.cookie('buildroonix_refresh', refreshToken, refreshCookie);

    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      institutionId: user.institutionId,
      institutionSlug: user.institution?.slug || null
    };

    return res.status(200).json({
      token,
      user: responseUser
    });
  } catch (error: any) {
    console.error('Login routing exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

router.post('/refresh', async (req: AuthenticatedRequest, res: Response) => {
  const presented = presentedRefreshToken(req);
  if (!presented) {
    return res.status(400).json({ error: 'ValidationError', message: 'Refresh token is required' });
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(presented) },
    include: { user: { include: { institution: true } } },
  });

  if (!stored || stored.revokedAt || stored.expiresAt <= new Date() || !stored.user.isApproved) {
    return res.status(401).json({ error: 'InvalidRefreshToken', message: 'Refresh token is invalid or expired' });
  }

  const nextRefreshToken = crypto.randomBytes(48).toString('base64url');
  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } }),
    prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(nextRefreshToken),
        userId: stored.userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    }),
  ]);
  res.cookie('buildroonix_refresh', nextRefreshToken, refreshCookie);

  return res.json({
    token: createAccessToken(stored.user),
  });
});

router.post('/logout', async (req: AuthenticatedRequest, res: Response) => {
  const presented = presentedRefreshToken(req);
  if (presented) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(presented), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  res.clearCookie('buildroonix_refresh', { ...refreshCookie, maxAge: undefined });
  return res.status(204).send();
});

export default router;
