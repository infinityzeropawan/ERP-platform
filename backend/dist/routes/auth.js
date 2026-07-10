"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = __importDefault(require("../config/db"));
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const hashToken = (token) => crypto_1.default.createHash('sha256').update(token).digest('hex');
const createAccessToken = (user) => jsonwebtoken_1.default.sign({
    id: user.id,
    email: user.email,
    role: user.role,
    institutionId: user.institutionId,
    institutionSlug: user.institution?.slug || null,
}, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
async function createRefreshToken(userId) {
    const token = crypto_1.default.randomBytes(48).toString('base64url');
    await db_1.default.refreshToken.create({
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
    secure: env_1.env.isProduction,
    sameSite: 'strict',
    path: '/api/v1/auth',
    maxAge: REFRESH_TOKEN_TTL_MS,
};
function presentedRefreshToken(req) {
    const cookie = req.headers.cookie
        ?.split(';')
        .map(value => value.trim().split('='))
        .find(([name]) => name === 'buildroonix_refresh')?.[1];
    return cookie ? decodeURIComponent(cookie) : '';
}
router.post('/register', async (req, res) => {
    const { name, email, phone, dob, gender, fatherName, motherName, address, bloodGroup, class: className, password, institutionSlug } = req.body;
    if (!email || !password || !name || !institutionSlug) {
        return res.status(400).json({ error: 'ValidationError', message: 'Name, email, password, and institution code are required.' });
    }
    try {
        // 1. Resolve institution by slug
        const institution = await db_1.default.institution.findUnique({
            where: { slug: institutionSlug }
        });
        if (!institution) {
            return res.status(404).json({ error: 'NotFound', message: 'Institution code is invalid.' });
        }
        // 2. Check if email already exists
        const existing = await db_1.default.user.findUnique({
            where: { email }
        });
        if (existing) {
            return res.status(400).json({ error: 'EmailTaken', message: 'This email is already registered.' });
        }
        // 3. Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // 4. Create pending student record
        const student = await db_1.default.user.create({
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
    }
    catch (error) {
        console.error('Student registration exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'ValidationError', message: 'Email and password are required' });
    }
    try {
        // Check against active DB records
        const user = await db_1.default.user.findUnique({
            where: { email },
            include: { institution: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'InvalidCredentials', message: 'Incorrect email or password' });
        }
        // Enforce approval check
        if (user.isApproved === false) {
            return res.status(403).json({ error: 'PendingApproval', message: 'Your account is pending administrator approval.' });
        }
        // Verify password with bcrypt
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
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
    }
    catch (error) {
        console.error('Login routing exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
router.post('/refresh', async (req, res) => {
    const presented = presentedRefreshToken(req);
    if (!presented) {
        return res.status(400).json({ error: 'ValidationError', message: 'Refresh token is required' });
    }
    const stored = await db_1.default.refreshToken.findUnique({
        where: { tokenHash: hashToken(presented) },
        include: { user: { include: { institution: true } } },
    });
    if (!stored || stored.revokedAt || stored.expiresAt <= new Date() || !stored.user.isApproved) {
        return res.status(401).json({ error: 'InvalidRefreshToken', message: 'Refresh token is invalid or expired' });
    }
    const nextRefreshToken = crypto_1.default.randomBytes(48).toString('base64url');
    await db_1.default.$transaction([
        db_1.default.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } }),
        db_1.default.refreshToken.create({
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
router.post('/logout', async (req, res) => {
    const presented = presentedRefreshToken(req);
    if (presented) {
        await db_1.default.refreshToken.updateMany({
            where: { tokenHash: hashToken(presented), revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    res.clearCookie('buildroonix_refresh', { ...refreshCookie, maxAge: undefined });
    return res.status(204).send();
});
exports.default = router;
