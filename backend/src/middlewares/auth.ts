import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { type UserRole } from '@prisma/client';
import { env } from '../config/env';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    institutionId?: string | null;
    institutionSlug?: string | null;
  };
  institutionId?: string | null;
}

// 1. Authenticate JWT token
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Access token missing' });
  }

  jwt.verify(token, env.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden', message: 'Access token invalid or expired' });
    }
    if (!decoded || typeof decoded === 'string') {
      return res.status(403).json({ error: 'Forbidden', message: 'Access token payload invalid' });
    }
    req.user = decoded as AuthenticatedRequest['user'];
    next();
  });
};

// 2. Authorize role memberships
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Role unauthorized. Required: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

// 3. Inject active Tenant/Institution context
export const injectTenantContext = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Superadmins can bypass tenant contexts
  if (req.user?.role === 'superadmin') {
    req.institutionId = null;
    return next();
  }

  // Retrieve tenant context from JWT token payload or custom header
  const tokenInstitutionId = req.user?.institutionId;
  // Enforce validation
  if (!tokenInstitutionId) {
    return res.status(400).json({
      error: 'TenantContextMissing',
      message: 'Active institution context could not be resolved from session.'
    });
  }

  req.institutionId = tokenInstitutionId;
  next();
};
