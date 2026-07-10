"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// 1. Get student's classmates and teachers assigned to their class/section
router.get('/class-info', async (req, res) => {
    const studentId = req.user?.id;
    const institutionId = req.institutionId;
    if (!studentId || !institutionId) {
        return res.status(400).json({ error: 'ContextMissing', message: 'No active student or institution context.' });
    }
    try {
        // Fetch logged-in student
        const student = await prisma.user.findUnique({
            where: { id: studentId }
        });
        if (!student || student.role !== 'student') {
            return res.status(404).json({ error: 'NotFound', message: 'Student profile not found.' });
        }
        const className = student.class;
        const section = student.section;
        if (!className || !section) {
            return res.status(200).json({
                className: 'Not Assigned',
                section: 'N/A',
                classmates: [],
                teachers: []
            });
        }
        // Fetch classmates
        const classmates = await prisma.user.findMany({
            where: {
                institutionId,
                role: 'student',
                class: className,
                section
            },
            select: {
                id: true,
                name: true,
                rollNo: true,
                profileColor: true
            },
            orderBy: { rollNo: 'asc' }
        });
        // Fetch teachers assigned to this class
        const teachers = await prisma.user.findMany({
            where: {
                institutionId,
                role: 'teacher',
                class: className,
                section
            },
            select: {
                id: true,
                name: true,
                qualification: true,
                email: true,
                phone: true
            }
        });
        // Map teacher's subject dynamically (using qualification or fallback)
        const formattedTeachers = teachers.map(t => ({
            id: t.id,
            name: t.name,
            subject: t.qualification || 'Subject General',
            qualification: t.qualification || 'B.Ed',
            email: t.email,
            phone: t.phone || 'N/A'
        }));
        return res.status(200).json({
            className,
            section,
            classmates,
            teachers: formattedTeachers
        });
    }
    catch (error) {
        console.error('Fetch student class-info exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 2. Get student's academic results
router.get('/results', async (req, res) => {
    const studentId = req.user?.id;
    const institutionId = req.institutionId;
    if (!studentId || !institutionId) {
        return res.status(400).json({ error: 'ContextMissing', message: 'No active student or institution context.' });
    }
    try {
        const results = await prisma.gradebookEntry.findMany({
            where: { studentId, institutionId },
            orderBy: { date: 'desc' }
        });
        const formattedResults = results.map(r => {
            // Determine grade letter from marks (assuming out of 100 for individual exam rows)
            const pct = Math.round(r.marks);
            let grade = 'F';
            if (pct >= 90)
                grade = 'A+';
            else if (pct >= 80)
                grade = 'A';
            else if (pct >= 70)
                grade = 'B+';
            else if (pct >= 60)
                grade = 'B';
            else if (pct >= 50)
                grade = 'C';
            else if (pct >= 40)
                grade = 'D';
            return {
                id: r.id,
                examType: r.examName, // Unit Test 1, Mid Term, etc.
                subject: r.subject,
                obtainedMarks: r.marks,
                maxMarks: r.examName.includes('Term') ? 100 : 25, // Mid Term is out of 100, others out of 25
                grade,
                remarks: r.remarks || 'No remarks.'
            };
        });
        return res.status(200).json(formattedResults);
    }
    catch (error) {
        console.error('Fetch student results exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
// 3. Get student's daily diaries
router.get('/diaries', async (req, res) => {
    const studentId = req.user?.id;
    const institutionId = req.institutionId;
    if (!studentId || !institutionId) {
        return res.status(400).json({ error: 'ContextMissing', message: 'No active student or institution context.' });
    }
    try {
        const student = await prisma.user.findUnique({
            where: { id: studentId }
        });
        if (!student || !student.class || !student.section) {
            return res.status(200).json([]);
        }
        const diaries = await prisma.dailyDiary.findMany({
            where: {
                institutionId,
                className: student.class,
                section: student.section,
                isPublished: true
            },
            orderBy: { date: 'desc' }
        });
        return res.status(200).json(diaries);
    }
    catch (error) {
        console.error('Fetch student diaries exception:', error);
        return res.status(500).json({ error: 'InternalError', message: error.message });
    }
});
exports.default = router;
