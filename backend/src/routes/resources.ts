import { Router, type Response } from 'express';
import xss from 'xss';
import prisma from '../config/db';
import { type AuthenticatedRequest } from '../middlewares/auth';
import { logger } from '../config/logger';

const router = Router();

// Helper to recursively sanitize object values
function sanitize<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item)) as any;
  }

  const sanitizedObj = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        sanitizedObj[key] = xss(value) as any;
      } else {
        sanitizedObj[key] = sanitize(value);
      }
    }
  }
  return sanitizedObj;
}

interface ResourceConfig {
  delegate: string;
  adminWrite?: boolean;
  teacherWrite?: boolean;
  selfCreate?: boolean;
}

const resources: Record<string, ResourceConfig> = {
  attendance: { delegate: 'attendance', adminWrite: true, teacherWrite: true },
  fees: { delegate: 'feeRecord', adminWrite: true },
  timetable: { delegate: 'timetablePeriod', adminWrite: true },
  notices: { delegate: 'notice', adminWrite: true },
  exams: { delegate: 'exam', adminWrite: true, teacherWrite: true },
  leaves: { delegate: 'leaveRequest', adminWrite: true, selfCreate: true },
  'online-classes': { delegate: 'onlineClass', adminWrite: true, teacherWrite: true },
  assignments: { delegate: 'assignment', adminWrite: true, teacherWrite: true },
  settings: { delegate: 'institutionSetting', adminWrite: true },
  syllabus: { delegate: 'syllabusUnit', adminWrite: true, teacherWrite: true },
  feedbacks: { delegate: 'feedbackSubmission', selfCreate: true },
  doubts: { delegate: 'doubt', adminWrite: true, teacherWrite: true, selfCreate: true },
  'doubt-replies': { delegate: 'doubtReply', adminWrite: true, teacherWrite: true, selfCreate: true },
  'online-exams': { delegate: 'onlineExam', adminWrite: true, teacherWrite: true },
  'mcq-questions': { delegate: 'mCQQuestion', adminWrite: true, teacherWrite: true },
  'exam-attempts': { delegate: 'examAttempt', selfCreate: true },
  'audit-logs': { delegate: 'auditLog', adminWrite: false },
  
  // Phase 4: Institution Specific Features
  'transport-routes': { delegate: 'transportRoute', adminWrite: true },
  'vehicles': { delegate: 'vehicle', adminWrite: true },
  'transport-assignments': { delegate: 'transportAssignment', adminWrite: true },
  'library-books': { delegate: 'libraryBook', adminWrite: true },
  'book-issues': { delegate: 'bookIssue', adminWrite: true },
  'hostels': { delegate: 'hostel', adminWrite: true },
  'hostel-rooms': { delegate: 'hostelRoom', adminWrite: true },
  'hostel-allocations': { delegate: 'hostelAllocation', adminWrite: true },
  
  'fee-structures': { delegate: 'feeStructure', adminWrite: true },
  'study-materials': { delegate: 'studyMaterial', adminWrite: true, teacherWrite: true },
  'leads': { delegate: 'lead', adminWrite: true },
  
  'subject-enrollments': { delegate: 'subjectEnrollment', adminWrite: true },
  'hourly-billing-records': { delegate: 'hourlyBillingRecord', adminWrite: true },
  'demo-class-bookings': { delegate: 'demoClassBooking', adminWrite: true, selfCreate: true },
  
  'semesters': { delegate: 'semester', adminWrite: true },
  'university-affiliations': { delegate: 'universityAffiliation', adminWrite: true },
  'elective-courses': { delegate: 'electiveCourse', adminWrite: true, teacherWrite: true },
  'research-theses': { delegate: 'researchThesis', adminWrite: true, teacherWrite: true, selfCreate: true },
  'alumni': { delegate: 'alumnus', adminWrite: true },
};

type ResourceName = keyof typeof resources;

function definition(name: string): ResourceConfig | undefined {
  return resources[name as ResourceName];
}

async function logAudit(req: AuthenticatedRequest, action: 'CREATE' | 'UPDATE' | 'DELETE', resource: string, resourceId: string, details: any) {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { name: true }
    });
    const userName = dbUser?.name || req.user!.email;

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        userName,
        userRole: req.user!.role,
        action,
        resource,
        resourceId,
        details: details ? JSON.parse(JSON.stringify(details)) : null,
        institutionId: req.institutionId!,
      }
    });
  } catch (err) {
    logger.error('Failed to write audit log', { error: err });
  }
}

router.get('/assignment-submissions', async (req: AuthenticatedRequest, res: Response) => {
  const where = req.user!.role === 'student'
    ? { studentId: req.user!.id, assignment: { institutionId: req.institutionId! } }
    : { assignment: { institutionId: req.institutionId! } };
  return res.json(await prisma.assignmentSubmission.findMany({
    where,
    orderBy: { submittedAt: 'desc' },
  }));
});

router.post('/assignment-submissions', async (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'student') return res.status(403).json({ error: 'Forbidden' });
  const assignment = await prisma.assignment.findFirst({
    where: { id: req.body.assignmentId, institutionId: req.institutionId! },
  });
  if (!assignment) return res.status(404).json({ error: 'AssignmentNotFound' });
  const submission = await prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: { assignmentId: assignment.id, studentId: req.user!.id },
    },
    create: {
      assignmentId: assignment.id,
      studentId: req.user!.id,
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

async function scopeFor(req: AuthenticatedRequest, resource: ResourceName) {
  const institutionId = req.institutionId!;
  const user = req.user!;
  const scope: Record<string, unknown> = { institutionId };

  if (resource === 'audit-logs' && user.role !== 'school_admin') {
    return { institutionId, id: '__forbidden__' };
  }

  if (user.role === 'student') {
    if (resource === 'attendance' || resource === 'fees' || resource === 'leaves' || resource === 'exam-attempts') {
      scope[resource === 'fees' || resource === 'exam-attempts' ? 'studentId' : 'userId'] = user.id;
    } else if (resource === 'feedbacks') {
      scope.studentId = user.id;
    } else if (resource === 'settings' || resource === 'syllabus' || resource === 'doubts' || resource === 'doubt-replies' || resource === 'mcq-questions' || resource === 'online-exams') {
      // Allow unrestricted retrieval of institution-wide resources
    } else {
      const profile = await prisma.user.findFirst({
        where: { id: user.id, institutionId },
        select: { class: true, section: true },
      });
      if (profile?.class) scope.className = profile.class;
      if (profile?.section) scope.section = profile.section;
      if (resource === 'notices') {
        delete scope.className;
        delete scope.section;
        scope.audience = { in: ['all', 'student'] };
      }
    }
  }

  if (user.role === 'teacher') {
    if (resource === 'attendance' || resource === 'leaves') scope.userId = user.id;
    if (resource === 'assignments' || resource === 'online-classes') scope.teacherId = user.id;
    if (resource === 'notices') scope.audience = { in: ['all', 'teacher'] };
    if (resource === 'feedbacks') {
      scope.targetType = 'teacher';
      scope.targetId = user.id;
    }
  }

  if (user.role === 'parent') {
    const child = await prisma.user.findFirst({
      where: { institutionId, role: 'student', parentId: user.id },
      select: { id: true, class: true, section: true },
    });
    if (!child) return { institutionId, id: '__no_linked_child__' };
    if (resource === 'attendance' || resource === 'leaves') scope.userId = child.id;
    else if (resource === 'fees' || resource === 'exam-attempts') scope.studentId = child.id;
    else if (resource === 'notices') scope.audience = { in: ['all', 'parent'] };
    else if (resource === 'feedbacks') scope.studentId = child.id;
    else if (resource === 'settings' || resource === 'syllabus' || resource === 'doubts' || resource === 'doubt-replies' || resource === 'online-exams' || resource === 'mcq-questions') {
      // Parent can read these
    } else {
      if (child.class) scope.className = child.class;
      if (child.section) scope.section = child.section;
    }
  }

  return scope;
}

router.get('/:resource', async (req: AuthenticatedRequest, res: Response) => {
  const resource = req.params.resource as ResourceName;
  const config = definition(resource);
  if (!config) return res.status(404).json({ error: 'UnknownResource' });

  const where = await scopeFor(req, resource);
  const include = resource === 'doubts' ? { replies: true } : resource === 'online-exams' ? { questions: true } : undefined;
  const records = await (prisma[config.delegate as any] as any).findMany({ where, include, orderBy: { createdAt: 'desc' } });
  if (resource === 'fees' && req.user!.role === 'school_admin') {
    const students = await prisma.user.findMany({
      where: { institutionId: req.institutionId!, role: 'student' },
      select: { id: true, name: true, rollNo: true },
    });
    const byId = new Map(students.map(student => [student.id, student]));
    return res.json((records as Array<Record<string, unknown>>).map(record => ({
      ...record,
      studentName: byId.get(record.studentId as string)?.name || 'Unknown student',
      rollNo: byId.get(record.studentId as string)?.rollNo || '—',
    })));
  }
  return res.json(records);
});

router.post('/:resource', async (req: AuthenticatedRequest, res: Response) => {
  const resource = req.params.resource as ResourceName;
  const config = definition(resource);
  if (!config) return res.status(404).json({ error: 'UnknownResource' });

  const role = req.user!.role;
  const permitted = role === 'school_admin'
    ? config.adminWrite
    : role === 'teacher'
      ? config.teacherWrite
      : config.selfCreate;
  if (!permitted) return res.status(403).json({ error: 'Forbidden' });

  const { id: _id, institutionId: _tenant, createdAt: _created, updatedAt: _updated, ...input } = sanitize(req.body);
  const dateFields = ['date', 'dueDate', 'paidDate', 'publishedAt', 'startsAt', 'fromDate', 'toDate', 'reviewedAt', 'dueAt', 'scheduledAt'];
  for (const field of dateFields) {
    if (typeof input[field] === 'string') input[field] = new Date(input[field]);
  }
  if (role === 'teacher' && (resource === 'assignments' || resource === 'online-classes')) {
    input.teacherId = req.user!.id;
  }
  if (role === 'student' && resource === 'leaves') input.userId = req.user!.id;
  if (role === 'student' && resource === 'feedbacks') input.studentId = req.user!.id;
  if (role === 'student' && resource === 'exam-attempts') input.studentId = req.user!.id;

  const record = await (prisma[config.delegate as any] as any).create({ data: { ...input, institutionId: req.institutionId } });

  if (resource === 'doubt-replies') {
    // update the parent doubt status
    await prisma.doubt.update({
      where: { id: input.doubtId },
      data: { status: 'answered' }
    });
  }

  await logAudit(req, 'CREATE', resource, record.id, record);

  return res.status(201).json(record);
});

router.patch('/:resource/:id', async (req: AuthenticatedRequest, res: Response) => {
  const resource = req.params.resource as ResourceName;
  const config = definition(resource);
  if (!config) return res.status(404).json({ error: 'UnknownResource' });
  const role = req.user!.role;
  if (role !== 'school_admin' && !(role === 'teacher' && config.teacherWrite)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const scope = await scopeFor(req, resource);
  const { id: _id, institutionId: _tenant, createdAt: _created, updatedAt: _updated, ...data } = req.body;
  const updated = await (prisma[config.delegate as any] as any).updateMany({ where: { id: req.params.id, ...scope }, data });
  if (!updated.count) return res.status(404).json({ error: 'NotFound' });

  await logAudit(req, 'UPDATE', resource, req.params.id, data);

  return res.json({ id: req.params.id, ...data });
});

router.delete('/:resource/:id', async (req: AuthenticatedRequest, res: Response) => {
  const resource = req.params.resource as ResourceName;
  const config = definition(resource);
  if (!config) return res.status(404).json({ error: 'UnknownResource' });
  const role = req.user!.role;
  if (role !== 'school_admin' && !(role === 'teacher' && config.teacherWrite)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const scope = await scopeFor(req, resource);
  const deleted = await (prisma[config.delegate as any] as any).deleteMany({ where: { id: req.params.id, ...scope } });
  
  if (deleted.count) {
    await logAudit(req, 'DELETE', resource, req.params.id, null);
    return res.status(204).send();
  }
  return res.status(404).json({ error: 'NotFound' });
});

export default router;
