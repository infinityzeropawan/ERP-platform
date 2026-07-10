import express, { type Request, type Response, type NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import authRoutes from './routes/auth';
import superadminRoutes from './routes/superadmin';
import adminRoutes from './routes/admin';
import teacherRoutes from './routes/teacher';
import studentRoutes from './routes/student';
import parentRoutes from './routes/parent';
import resourceRoutes from './routes/resources';
import reportsRoutes from './routes/reports';
import uploadRoutes from './routes/upload';
import pdfRoutes from './routes/pdf';
import integrationsRoutes from './routes/integrations';
import notificationsRoutes from './routes/notifications';
import paymentsRoutes from './routes/payments';
import chatRoutes from './routes/chat';
import aiRoutes from './routes/ai';
import { initWebSocketServer } from './services/websocketService';
import { authenticateToken, injectTenantContext, requireRole } from './middlewares/auth';
import { requireHttps, sanitizeBody } from './middlewares/security';
import { env } from './config/env';
import { logger } from './config/logger';

const app = express();

if (env.isProduction) app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.frontendOrigins.includes(origin.replace(/\/$/, ''))) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(morgan('combined', {
  stream: { write: (message) => logger.http(message.trim()) },
  skip: (req) => req.path === '/api/health',
}));
app.use(requireHttps);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeBody);

import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Raw body parser for Stripe/Razorpay webhooks (must be before JSON middleware)
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'production' ? 20 : 10000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'TooManyRequests', message: 'Too many authentication attempts. Try again later.' },
});
app.use('/api/v1/auth/register', authLimiter);

// Server API health checks
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Register routes with middle tier security constraints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/superadmin', authenticateToken, requireRole(['superadmin']), superadminRoutes);
app.use('/api/v1/admin', authenticateToken, requireRole(['school_admin']), injectTenantContext, adminRoutes);
app.use('/api/v1/admin/reports', authenticateToken, requireRole(['school_admin', 'superadmin']), reportsRoutes);
app.use('/api/v1/teacher', authenticateToken, requireRole(['teacher']), injectTenantContext, teacherRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/admin/pdf', pdfRoutes);
app.use('/api/v1/admin/integrations', integrationsRoutes);
app.use('/api/v1/admin/notifications', notificationsRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/chat', authenticateToken, injectTenantContext, chatRoutes);
app.use('/api/v1/ai', authenticateToken, injectTenantContext, aiRoutes);

// Generic resources endpoint (Must be last to avoid catching specific routes)
app.use('/api/v1/:resourceName', authenticateToken, injectTenantContext, resourceRoutes);
app.use('/api/v1/student', authenticateToken, requireRole(['student']), injectTenantContext, studentRoutes);
app.use('/api/v1/parent', authenticateToken, requireRole(['parent']), injectTenantContext, parentRoutes);
app.use(
  '/api/v1/resources',
  authenticateToken,
  requireRole(['school_admin', 'teacher', 'student', 'parent']),
  injectTenantContext,
  resourceRoutes,
);

// Centralized error boundary
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled server exception', { error: err, method: req.method, path: req.path });
  res.status(500).json({
    error: 'InternalServerError',
    message: env.isProduction ? 'An unexpected exception occurred on the server.' : err.message
  });
});

// Listen — using http.createServer to support WebSocket on same port
const server = createServer(app);
initWebSocketServer(server);
server.listen(env.port, () => {
  logger.info('Buildroonix ERP backend started', { port: env.port, environment: env.nodeEnv });
});
