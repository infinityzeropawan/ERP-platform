"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
const resources = {
    attendance: { delegate: 'attendance', adminWrite: true, teacherWrite: true },
    fees: { delegate: 'feeRecord', adminWrite: true },
    timetable: { delegate: 'timetablePeriod', adminWrite: true },
    notices: { delegate: 'notice', adminWrite: true },
    exams: { delegate: 'exam', adminWrite: true, teacherWrite: true },
    leaves: { delegate: 'leaveRequest', adminWrite: true, selfCreate: true },
    'online-classes': { delegate: 'onlineClass', adminWrite: true, teacherWrite: true },
    assignments: { delegate: 'assignment', adminWrite: true, teacherWrite: true },
};
function definition(name) {
    return resources[name];
}
router.get('/assignment-submissions', async (req, res) => {
    const where = req.user.role === 'student'
        ? { studentId: req.user.id, assignment: { institutionId: req.institutionId } }
        : { assignment: { institutionId: req.institutionId } };
    return res.json(await db_1.default.assignmentSubmission.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
    }));
});
router.post('/assignment-submissions', async (req, res) => {
    if (req.user.role !== 'student')
        return res.status(403).json({ error: 'Forbidden' });
    const assignment = await db_1.default.assignment.findFirst({
        where: { id: req.body.assignmentId, institutionId: req.institutionId },
    });
    if (!assignment)
        return res.status(404).json({ error: 'AssignmentNotFound' });
    const submission = await db_1.default.assignmentSubmission.upsert({
        where: {
            assignmentId_studentId: { assignmentId: assignment.id, studentId: req.user.id },
        },
        create: {
            assignmentId: assignment.id,
            studentId: req.user.id,
            notes: req.body.notes || null,
            contentUrl: req.body.contentUrl || null,
        },
        update: {
            notes: req.body.notes || null,
            contentUrl: req.body.contentUrl || null,
            submittedAt: new Date(),
        },
    });
    return res.status(201).json(submission);
});
async function scopeFor(req, resource) {
    const institutionId = req.institutionId;
    const user = req.user;
    const scope = { institutionId };
    if (user.role === 'student') {
        if (resource === 'attendance' || resource === 'fees' || resource === 'leaves') {
            scope[resource === 'fees' ? 'studentId' : 'userId'] = user.id;
        }
        else {
            const profile = await db_1.default.user.findFirst({
                where: { id: user.id, institutionId },
                select: { class: true, section: true },
            });
            if (profile?.class)
                scope.className = profile.class;
            if (profile?.section)
                scope.section = profile.section;
            if (resource === 'notices') {
                delete scope.className;
                delete scope.section;
                scope.audience = { in: ['all', 'student'] };
            }
        }
    }
    if (user.role === 'teacher') {
        if (resource === 'attendance' || resource === 'leaves')
            scope.userId = user.id;
        if (resource === 'assignments' || resource === 'online-classes')
            scope.teacherId = user.id;
        if (resource === 'notices')
            scope.audience = { in: ['all', 'teacher'] };
    }
    if (user.role === 'parent') {
        const child = await db_1.default.user.findFirst({
            where: { institutionId, role: 'student', parentId: user.id },
            select: { id: true, class: true, section: true },
        });
        if (!child)
            return { institutionId, id: '__no_linked_child__' };
        if (resource === 'attendance' || resource === 'leaves')
            scope.userId = child.id;
        else if (resource === 'fees')
            scope.studentId = child.id;
        else if (resource === 'notices')
            scope.audience = { in: ['all', 'parent'] };
        else {
            if (child.class)
                scope.className = child.class;
            if (child.section)
                scope.section = child.section;
        }
    }
    return scope;
}
router.get('/:resource', async (req, res) => {
    const resource = req.params.resource;
    const config = definition(resource);
    if (!config)
        return res.status(404).json({ error: 'UnknownResource' });
    const where = await scopeFor(req, resource);
    const records = await db_1.default[config.delegate].findMany({ where, orderBy: { createdAt: 'desc' } });
    if (resource === 'fees' && req.user.role === 'school_admin') {
        const students = await db_1.default.user.findMany({
            where: { institutionId: req.institutionId, role: 'student' },
            select: { id: true, name: true, rollNo: true },
        });
        const byId = new Map(students.map(student => [student.id, student]));
        return res.json(records.map(record => ({
            ...record,
            studentName: byId.get(record.studentId)?.name || 'Unknown student',
            rollNo: byId.get(record.studentId)?.rollNo || '—',
        })));
    }
    return res.json(records);
});
router.post('/:resource', async (req, res) => {
    const resource = req.params.resource;
    const config = definition(resource);
    if (!config)
        return res.status(404).json({ error: 'UnknownResource' });
    const role = req.user.role;
    const permitted = role === 'school_admin'
        ? config.adminWrite
        : role === 'teacher'
            ? 'teacherWrite' in config && config.teacherWrite
            : 'selfCreate' in config && config.selfCreate;
    if (!permitted)
        return res.status(403).json({ error: 'Forbidden' });
    const { id: _id, institutionId: _tenant, createdAt: _created, updatedAt: _updated, ...input } = req.body;
    const dateFields = ['date', 'dueDate', 'paidDate', 'publishedAt', 'startsAt', 'fromDate', 'toDate', 'reviewedAt', 'dueAt'];
    for (const field of dateFields) {
        if (typeof input[field] === 'string')
            input[field] = new Date(input[field]);
    }
    if (role === 'teacher' && (resource === 'assignments' || resource === 'online-classes')) {
        input.teacherId = req.user.id;
    }
    if (role === 'student' && resource === 'leaves')
        input.userId = req.user.id;
    const record = await db_1.default[config.delegate].create({ data: { ...input, institutionId: req.institutionId } });
    return res.status(201).json(record);
});
router.patch('/:resource/:id', async (req, res) => {
    const resource = req.params.resource;
    const config = definition(resource);
    if (!config)
        return res.status(404).json({ error: 'UnknownResource' });
    const role = req.user.role;
    if (role !== 'school_admin' && !(role === 'teacher' && 'teacherWrite' in config && config.teacherWrite)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const scope = await scopeFor(req, resource);
    const { id: _id, institutionId: _tenant, createdAt: _created, updatedAt: _updated, ...data } = req.body;
    const updated = await db_1.default[config.delegate].updateMany({ where: { id: req.params.id, ...scope }, data });
    if (!updated.count)
        return res.status(404).json({ error: 'NotFound' });
    return res.json({ id: req.params.id, ...data });
});
router.delete('/:resource/:id', async (req, res) => {
    const resource = req.params.resource;
    const config = definition(resource);
    if (!config)
        return res.status(404).json({ error: 'UnknownResource' });
    const role = req.user.role;
    if (role !== 'school_admin' && !(role === 'teacher' && 'teacherWrite' in config && config.teacherWrite)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const scope = await scopeFor(req, resource);
    const deleted = await db_1.default[config.delegate].deleteMany({ where: { id: req.params.id, ...scope } });
    return deleted.count ? res.status(204).send() : res.status(404).json({ error: 'NotFound' });
});
exports.default = router;
