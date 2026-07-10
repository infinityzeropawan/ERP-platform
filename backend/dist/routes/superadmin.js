"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const DEFAULT_MODULES = {
    school: [
        'mod_timetable', 'mod_attendance', 'mod_assignments', 'mod_exams',
        'mod_syllabus', 'mod_student_dir', 'mod_leave', 'mod_fee_management',
        'mod_reports', 'mod_gradebook', 'mod_daily_diary', 'mod_parent_comm'
    ],
    coaching: [
        'mod_timetable', 'mod_attendance', 'mod_assignments', 'mod_exams',
        'mod_online_exams', 'mod_study_material', 'mod_student_dir',
        'mod_gradebook', 'mod_parent_comm'
    ],
    online_teaching: [
        'mod_timetable', 'mod_assignments', 'mod_online_classes', 'mod_study_material',
        'mod_online_exams', 'mod_student_dir'
    ],
    college: [
        'mod_timetable', 'mod_attendance', 'mod_exams', 'mod_syllabus',
        'mod_student_dir', 'mod_leave', 'mod_fee_management', 'mod_reports'
    ],
    tuition: [
        'mod_timetable', 'mod_attendance', 'mod_assignments', 'mod_exams',
        'mod_student_dir'
    ],
    hybrid: [
        'mod_timetable', 'mod_attendance', 'mod_assignments', 'mod_exams',
        'mod_online_exams', 'mod_online_classes', 'mod_study_material', 'mod_student_dir',
        'mod_leave', 'mod_fee_management', 'mod_reports'
    ]
};
const router = (0, express_1.Router)();
// 1. Onboard a new institution tenant
router.post('/institutions', async (req, res) => {
    const { name, slug, type, plan, adminName, adminEmail, adminPassword } = req.body;
    if (!name || !slug || !adminEmail || !adminPassword) {
        return res.status(400).json({ error: 'ValidationError', message: 'Institution name, unique slug, and admin login details are required.' });
    }
    try {
        // Check if slug is unique
        const existing = await db_1.default.institution.findUnique({ where: { slug } });
        if (existing) {
            return res.status(409).json({ error: 'ConflictError', message: 'An institution with this slug already exists.' });
        }
        // Resolve default modules for type
        const resolvedType = (type || 'school');
        const defaultModulesList = DEFAULT_MODULES[resolvedType] || [];
        const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
        // Create transaction: Onboard institution and seed its Admin User account
        const result = await db_1.default.$transaction(async (tx) => {
            const inst = await tx.institution.create({
                data: {
                    name,
                    slug,
                    type: resolvedType,
                    plan: plan || 'basic',
                    status: 'active',
                    enabledModules: defaultModulesList,
                }
            });
            const adminUser = await tx.user.create({
                data: {
                    name: adminName || `${name} Admin`,
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'school_admin',
                    institutionId: inst.id
                }
            });
            return { inst, adminUser };
        });
        return res.status(201).json({
            message: 'Institution onboarded successfully',
            institution: result.inst,
            admin: {
                id: result.adminUser.id,
                name: result.adminUser.name,
                email: result.adminUser.email
            }
        });
    }
    catch (error) {
        console.error('Superadmin onboarding exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 2. List all registered institutions
router.get('/institutions', async (req, res) => {
    try {
        const list = await db_1.default.institution.findMany({
            include: {
                _count: {
                    select: { users: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(list);
    }
    catch (error) {
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 3. Update status (active, suspended, trial)
router.put('/institutions/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ error: 'ValidationError', message: 'Status field is required.' });
    }
    try {
        const updated = await db_1.default.institution.update({
            where: { id },
            data: { status }
        });
        return res.status(200).json(updated);
    }
    catch (error) {
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 4. Customize feature module access list
router.put('/institutions/:id/modules', async (req, res) => {
    const { id } = req.params;
    const { enabledModules } = req.body;
    if (!Array.isArray(enabledModules)) {
        return res.status(400).json({ error: 'ValidationError', message: 'enabledModules must be a string array.' });
    }
    try {
        const updated = await db_1.default.institution.update({
            where: { id },
            data: { enabledModules }
        });
        return res.status(200).json(updated);
    }
    catch (error) {
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 5. Update subscription plan (basic, pro, enterprise)
router.put('/institutions/:id/plan', async (req, res) => {
    const { id } = req.params;
    const { plan } = req.body;
    if (!plan) {
        return res.status(400).json({ error: 'ValidationError', message: 'Plan field is required.' });
    }
    try {
        const updated = await db_1.default.institution.update({
            where: { id },
            data: { plan }
        });
        return res.status(200).json(updated);
    }
    catch (error) {
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 6. List platform announcements
router.get('/announcements', async (req, res) => {
    try {
        const list = await db_1.default.notice.findMany({
            where: { audience: 'all' },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(list);
    }
    catch (error) {
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 7. Create platform announcement
router.post('/announcements', async (req, res) => {
    const { title, content, targetType } = req.body;
    if (!title || !content)
        return res.status(400).json({ error: 'ValidationError', message: 'title and content are required.' });
    try {
        const ann = await db_1.default.notice.create({
            data: {
                title, content, authorId: req.user.id, authorName: 'Superadmin',
                priority: 'medium', category: targetType || 'all', audience: 'all',
                publishedAt: new Date(),
                institutionId: (await db_1.default.institution.findFirst({ orderBy: { createdAt: 'asc' } }))?.id || '',
            },
        });
        return res.status(201).json(ann);
    }
    catch (error) {
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 8. Delete platform announcement
router.delete('/announcements/:id', async (req, res) => {
    try {
        await db_1.default.notice.delete({ where: { id: req.params.id } });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
exports.default = router;
