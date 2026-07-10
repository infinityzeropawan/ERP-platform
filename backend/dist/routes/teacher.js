"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// 1. Get teacher's own payroll history
router.get('/payroll', async (req, res) => {
    const teacherId = req.user?.id;
    const institutionId = req.institutionId;
    if (!teacherId || !institutionId) {
        return res.status(400).json({ error: 'ContextMissing', message: 'No active teacher or institution context.' });
    }
    try {
        const payrolls = await prisma.staffPayroll.findMany({
            where: { staffId: teacherId, institutionId },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(payrolls);
    }
    catch (error) {
        console.error('Fetch teacher payroll exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 2. Get daily diary entries
router.get('/diaries', async (req, res) => {
    const institutionId = req.institutionId;
    if (!institutionId) {
        return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
    }
    try {
        const diaries = await prisma.dailyDiary.findMany({
            where: { institutionId },
            orderBy: { date: 'desc' }
        });
        return res.status(200).json(diaries);
    }
    catch (error) {
        console.error('Fetch diaries exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 3. Create a daily diary entry
router.post('/diaries', async (req, res) => {
    const institutionId = req.institutionId;
    const { classId, className, section, subject, teacherName, classwork, homework, date, isPublished } = req.body;
    if (!institutionId) {
        return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
    }
    try {
        const newDiary = await prisma.dailyDiary.create({
            data: {
                classId: classId || `${className}-${section}`,
                className: className || 'Class-X',
                section: section || 'A',
                subject: subject || 'General',
                teacherName: teacherName || 'Instructor',
                classwork: classwork || '',
                homework: homework || '',
                date: date ? new Date(date) : new Date(),
                isPublished: isPublished !== false,
                institutionId
            }
        });
        return res.status(201).json(newDiary);
    }
    catch (error) {
        console.error('Create diary exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 4. Update a daily diary entry
router.put('/diaries/:id', async (req, res) => {
    const institutionId = req.institutionId;
    const { id } = req.params;
    const { className, section, subject, teacherName, classwork, homework, date, isPublished } = req.body;
    if (!institutionId) {
        return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
    }
    try {
        const updated = await prisma.dailyDiary.update({
            where: { id },
            data: {
                className,
                section,
                subject,
                teacherName,
                classwork,
                homework,
                date: date ? new Date(date) : undefined,
                isPublished: isPublished !== false
            }
        });
        return res.status(200).json(updated);
    }
    catch (error) {
        console.error('Update diary exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 5. Delete a daily diary entry
router.delete('/diaries/:id', async (req, res) => {
    const institutionId = req.institutionId;
    const { id } = req.params;
    if (!institutionId) {
        return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
    }
    try {
        await prisma.dailyDiary.delete({
            where: { id }
        });
        return res.status(200).json({ message: 'Diary entry deleted successfully.' });
    }
    catch (error) {
        console.error('Delete diary exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 6. Get pivoted Gradebook entries for a class/subject
router.get('/gradebook', async (req, res) => {
    const institutionId = req.institutionId;
    const subject = req.query.subject;
    const className = req.query.class;
    const section = req.query.section;
    if (!institutionId) {
        return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
    }
    if (!subject || !className || !section) {
        return res.status(400).json({ error: 'ValidationError', message: 'Subject, class, and section are required.' });
    }
    try {
        // Fetch all students in this class/section
        const students = await prisma.user.findMany({
            where: { institutionId, role: 'student', class: className, section },
            orderBy: { rollNo: 'asc' }
        });
        // Fetch all GradebookEntry records for this subject/institution
        const entries = await prisma.gradebookEntry.findMany({
            where: { institutionId, subject }
        });
        // Pivot scores for each student
        const pivoted = students.map(s => {
            const studentEntries = entries.filter(e => e.studentId === s.id);
            const ut1 = studentEntries.find(e => e.examName === 'Unit Test 1')?.marks || 0;
            const ut2 = studentEntries.find(e => e.examName === 'Unit Test 2')?.marks || 0;
            const mid = studentEntries.find(e => e.examName === 'Mid Term')?.marks || 0;
            const asgn = studentEntries.find(e => e.examName === 'Assignment')?.marks || 0;
            const prac = studentEntries.find(e => e.examName === 'Practical')?.marks || 0;
            const remarks = studentEntries.find(e => e.remarks)?.remarks || '';
            const totalScore = ut1 + ut2 + mid + asgn + prac;
            const percentage = Math.round((totalScore / 225) * 100);
            let grade = 'F';
            if (percentage >= 90)
                grade = 'A+';
            else if (percentage >= 80)
                grade = 'A';
            else if (percentage >= 70)
                grade = 'B+';
            else if (percentage >= 60)
                grade = 'B';
            else if (percentage >= 50)
                grade = 'C';
            else if (percentage >= 40)
                grade = 'D';
            return {
                id: s.id,
                studentName: s.name,
                rollNo: s.rollNo || '000',
                unitTest1: ut1,
                unitTest2: ut2,
                midTerm: mid,
                assignment: asgn,
                practical: prac,
                totalScore,
                percentage,
                grade,
                remarks
            };
        });
        return res.status(200).json(pivoted);
    }
    catch (error) {
        console.error('Fetch gradebook exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 7. Save batch Gradebook updates (upsert transaction)
router.post('/gradebook/batch', async (req, res) => {
    const institutionId = req.institutionId;
    const { subject, entries } = req.body;
    if (!institutionId) {
        return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
    }
    if (!subject || !Array.isArray(entries)) {
        return res.status(400).json({ error: 'ValidationError', message: 'Subject and entries array are required.' });
    }
    try {
        const upserts = [];
        for (const e of entries) {
            const examTypes = [
                { name: 'Unit Test 1', val: e.unitTest1 },
                { name: 'Unit Test 2', val: e.unitTest2 },
                { name: 'Mid Term', val: e.midTerm },
                { name: 'Assignment', val: e.assignment },
                { name: 'Practical', val: e.practical }
            ];
            for (const exam of examTypes) {
                if (exam.val !== undefined && exam.val !== null) {
                    // Find existing record
                    const existing = await prisma.gradebookEntry.findFirst({
                        where: {
                            institutionId,
                            studentId: e.id,
                            subject,
                            examName: exam.name
                        }
                    });
                    if (existing) {
                        upserts.push(prisma.gradebookEntry.update({
                            where: { id: existing.id },
                            data: {
                                marks: Number(exam.val),
                                remarks: e.remarks || undefined
                            }
                        }));
                    }
                    else {
                        upserts.push(prisma.gradebookEntry.create({
                            data: {
                                studentId: e.id,
                                studentName: e.studentName,
                                subject,
                                examName: exam.name,
                                marks: Number(exam.val),
                                remarks: e.remarks || '',
                                date: new Date(),
                                institutionId
                            }
                        }));
                    }
                }
            }
        }
        if (upserts.length > 0) {
            await prisma.$transaction(upserts);
        }
        return res.status(200).json({ message: 'Gradebook batch saved successfully.', count: upserts.length });
    }
    catch (error) {
        console.error('Batch save gradebook exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// Fetch students list for dropdown selections
router.get('/students', async (req, res) => {
    const institutionId = req.institutionId;
    if (!institutionId) {
        return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
    }
    try {
        const students = await prisma.user.findMany({
            where: { institutionId, role: 'student' },
            select: { id: true, name: true, email: true, class: true, section: true, fatherName: true },
            orderBy: { name: 'asc' }
        });
        return res.status(200).json(students);
    }
    catch (error) {
        console.error('Teacher fetch students list exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// --- PARENT COMMUNICATION ENDPOINTS (PHASE 4) ---
// 1. Get all parent communication messages
router.get('/parent-messages', async (req, res) => {
    const institutionId = req.institutionId;
    if (!institutionId) {
        return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
    }
    try {
        const messages = await prisma.parentMessage.findMany({
            where: { institutionId },
            orderBy: { createdAt: 'desc' }
        });
        // Resolve student names dynamically to ensure accuracy
        const studentIds = Array.from(new Set(messages.map(m => m.studentId)));
        const students = await prisma.user.findMany({
            where: { id: { in: studentIds } },
            select: { id: true, name: true }
        });
        const studentMap = new Map(students.map(s => [s.id, s.name]));
        const formatted = messages.map(m => ({
            id: m.id,
            teacherId: m.teacherId,
            studentId: m.studentId,
            studentName: studentMap.get(m.studentId) || 'Student',
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
        console.error('Fetch parent-messages exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 2. Post a new message/alert to a parent
router.post('/parent-messages', async (req, res) => {
    const institutionId = req.institutionId;
    const teacherId = req.user?.id;
    const { studentId, parentName, subject, body, category, priority, isBroadcast, classId } = req.body;
    if (!institutionId || !teacherId) {
        return res.status(400).json({ error: 'ContextMissing', message: 'No active teacher or institution context.' });
    }
    if (!studentId || !parentName || !subject || !body) {
        return res.status(400).json({ error: 'ValidationError', message: 'studentId, parentName, subject and body are required.' });
    }
    try {
        const newMessage = await prisma.parentMessage.create({
            data: {
                teacherId,
                studentId,
                parentName,
                subject,
                body,
                category: category || 'general',
                priority: priority || 'normal',
                isBroadcast: isBroadcast === true,
                classId: classId || null,
                institutionId
            }
        });
        return res.status(201).json(newMessage);
    }
    catch (error) {
        console.error('Create parent-message exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
exports.default = router;
