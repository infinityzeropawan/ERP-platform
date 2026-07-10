"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const superadmin_1 = __importDefault(require("./routes/superadmin"));
const admin_1 = __importDefault(require("./routes/admin"));
const teacher_1 = __importDefault(require("./routes/teacher"));
const student_1 = __importDefault(require("./routes/student"));
const parent_1 = __importDefault(require("./routes/parent"));
const resources_1 = __importDefault(require("./routes/resources"));
const auth_2 = require("./middlewares/auth");
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const app = (0, express_1.default)();
if (env_1.env.isProduction)
    app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (!origin || env_1.env.frontendOrigins.includes(origin.replace(/\/$/, '')))
            return callback(null, true);
        return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
}));
app.use((0, morgan_1.default)('combined', {
    stream: { write: (message) => logger_1.logger.http(message.trim()) },
    skip: (req) => req.path === '/api/health',
}));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'TooManyRequests', message: 'Too many authentication attempts. Try again later.' },
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
// Server API health checks
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});
// Register routes with middle tier security constraints
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/superadmin', auth_2.authenticateToken, (0, auth_2.requireRole)(['superadmin']), superadmin_1.default);
app.use('/api/v1/admin', auth_2.authenticateToken, (0, auth_2.requireRole)(['school_admin']), auth_2.injectTenantContext, admin_1.default);
app.use('/api/v1/teacher', auth_2.authenticateToken, (0, auth_2.requireRole)(['teacher']), auth_2.injectTenantContext, teacher_1.default);
app.use('/api/v1/student', auth_2.authenticateToken, (0, auth_2.requireRole)(['student']), auth_2.injectTenantContext, student_1.default);
app.use('/api/v1/parent', auth_2.authenticateToken, (0, auth_2.requireRole)(['parent']), auth_2.injectTenantContext, parent_1.default);
app.use('/api/v1/resources', auth_2.authenticateToken, (0, auth_2.requireRole)(['school_admin', 'teacher', 'student', 'parent']), auth_2.injectTenantContext, resources_1.default);
// Centralized error boundary
app.use((err, req, res, next) => {
    logger_1.logger.error('Unhandled server exception', { error: err, method: req.method, path: req.path });
    res.status(500).json({
        error: 'InternalServerError',
        message: env_1.env.isProduction ? 'An unexpected exception occurred on the server.' : err.message
    });
});
// Listen
app.listen(env_1.env.port, () => {
    logger_1.logger.info('Buildroonix ERP backend started', { port: env_1.env.port, environment: env_1.env.nodeEnv });
});
