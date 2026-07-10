"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectTenantContext = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
// 1. Authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const [scheme, token] = authHeader?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Access token missing' });
    }
    jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden', message: 'Access token invalid or expired' });
        }
        if (!decoded || typeof decoded === 'string') {
            return res.status(403).json({ error: 'Forbidden', message: 'Access token payload invalid' });
        }
        req.user = decoded;
        next();
    });
};
exports.authenticateToken = authenticateToken;
// 2. Authorize role memberships
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Role unauthorized. Required: ${allowedRoles.join(', ')}`
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
// 3. Inject active Tenant/Institution context
const injectTenantContext = (req, res, next) => {
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
exports.injectTenantContext = injectTenantContext;
