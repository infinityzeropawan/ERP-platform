"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Helper to resolve child student profile for logged-in parent
async function resolveChild(parentId, institutionId) {
    const parent = await prisma.user.findUnique({
        where: { id: parentId }
    });
    if (!parent)
        return null;
    const child = await prisma.user.findFirst({
        where: {
            institutionId,
            role: 'student',
            parentId: parent.id,
        }
    });
    return { parent, child };
}
// 1. Get child details for parent dashboard
router.get('/child-info', async (req, res) => {
    const parentId = req.user?.id;
    const institutionId = req.institutionId;
    if (!parentId || !institutionId) {
        return res.status(400).json({ error: 'ContextMissing', message: 'No active parent or institution context.' });
    }
    try {
        const resolved = await resolveChild(parentId, institutionId);
        if (!resolved || !resolved.child) {
            return res.status(404).json({ error: 'NotFound', message: 'No child student profile associated with this parent.' });
        }
        return res.status(200).json({
            parentName: resolved.parent.name,
            child: resolved.child
        });
    }
    catch (error) {
        console.error('Fetch child-info exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 2. Get communication messages list from teachers/admin
router.get('/messages', async (req, res) => {
    const parentId = req.user?.id;
    const institutionId = req.institutionId;
    if (!parentId || !institutionId) {
        return res.status(400).json({ error: 'ContextMissing', message: 'No active parent or institution context.' });
    }
    try {
        const resolved = await resolveChild(parentId, institutionId);
        if (!resolved || !resolved.child) {
            return res.status(200).json([]);
        }
        const messages = await prisma.parentMessage.findMany({
            where: {
                institutionId,
                OR: [
                    { studentId: resolved.child.id },
                    { isBroadcast: true }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
        // Format output with student & parent names
        const formatted = messages.map(m => ({
            id: m.id,
            teacherId: m.teacherId,
            studentId: m.studentId,
            studentName: resolved.child?.name || 'Student',
            parentName: m.parentName,
            subject: m.subject,
            body: m.body,
            category: m.category,
            priority: m.priority,
            isBroadcast: m.isBroadcast,
            classId: m.classId,
            isRead: m.isRead,
            createdAt: m.createdAt.toISOString()
        }));
        return res.status(200).json(formatted);
    }
    catch (error) {
        console.error('Fetch parent messages exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 3. Send message to teacher/admin
router.post('/messages', async (req, res) => {
    const parentId = req.user?.id;
    const institutionId = req.institutionId;
    const { subject, body, category, priority } = req.body;
    if (!parentId || !institutionId) {
        return res.status(400).json({ error: 'ContextMissing', message: 'No active parent or institution context.' });
    }
    if (!subject || !body) {
        return res.status(400).json({ error: 'ValidationError', message: 'Subject and body are required.' });
    }
    try {
        const resolved = await resolveChild(parentId, institutionId);
        if (!resolved || !resolved.child) {
            return res.status(404).json({ error: 'NotFound', message: 'No associated child student profile found.' });
        }
        const newMessage = await prisma.parentMessage.create({
            data: {
                teacherId: 'admin', // Directed to administrator by default
                studentId: resolved.child.id,
                parentName: resolved.parent.name,
                subject,
                body,
                category: category || 'general',
                priority: priority || 'normal',
                isBroadcast: false,
                institutionId
            }
        });
        return res.status(201).json(newMessage);
    }
    catch (error) {
        console.error('Create parent message exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
exports.default = router;
