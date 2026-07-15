import { Router, type Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { type AuthenticatedRequest } from '../middlewares/auth';
import { type InstitutionType } from '@prisma/client';
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

const router = Router();

// 1. Onboard a new institution tenant
router.post('/institutions', async (req: AuthenticatedRequest, res: Response) => {
  const { name, slug, type, plan, adminName, adminEmail, adminPassword } = req.body;

  if (!name || !slug || !adminEmail || !adminPassword) {
    return res.status(400).json({ error: 'ValidationError', message: 'Institution name, unique slug, and admin login details are required.' });
  }

  try {
    // Check if slug is unique
    const existing = await prisma.institution.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ error: 'ConflictError', message: 'An institution with this slug already exists.' });
    }

    // Resolve default modules for type
    const resolvedType = (type || 'school') as InstitutionType;
    const defaultModulesList = DEFAULT_MODULES[resolvedType as keyof typeof DEFAULT_MODULES] || [];

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Generate a 5-letter unique uppercase alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Create transaction: Onboard institution and seed its Admin User account
    const result = await prisma.$transaction(async (tx) => {
      // Check if generated code happens to collide (extremely rare, but good practice)
      let uniqueCode = code;
      while (await tx.institution.findUnique({ where: { code: uniqueCode } })) {
        uniqueCode = '';
        for (let i = 0; i < 5; i++) {
          uniqueCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }

      const inst = await tx.institution.create({
        data: {
          name,
          slug,
          code: uniqueCode,
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
  } catch (error: any) {
    console.error('Superadmin onboarding exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 2. List all registered institutions
router.get('/institutions', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.institution.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 3. Update status (active, suspended, trial)
router.put('/institutions/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'ValidationError', message: 'Status field is required.' });
  }

  try {
    const updated = await prisma.institution.update({
      where: { id },
      data: { status }
    });
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 4. Customize feature module access list
router.put('/institutions/:id/modules', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { enabledModules } = req.body;

  if (!Array.isArray(enabledModules)) {
    return res.status(400).json({ error: 'ValidationError', message: 'enabledModules must be a string array.' });
  }

  try {
    const updated = await prisma.institution.update({
      where: { id },
      data: { enabledModules }
    });
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 5. Update subscription plan (basic, pro, enterprise)
router.put('/institutions/:id/plan', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { plan } = req.body;

  if (!plan) {
    return res.status(400).json({ error: 'ValidationError', message: 'Plan field is required.' });
  }

  try {
    const updated = await prisma.institution.update({
      where: { id },
      data: { plan }
    });
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 6. List platform announcements
router.get('/announcements', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.notice.findMany({
      where: { audience: 'all' },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(list);
  } catch (error: any) {
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 7. Create platform announcement
router.post('/announcements', async (req: AuthenticatedRequest, res: Response) => {
  const { title, content, targetType } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'ValidationError', message: 'title and content are required.' });
  try {
    const ann = await prisma.notice.create({
      data: {
        title, content, authorId: req.user!.id, authorName: 'Superadmin',
        priority: 'medium', category: targetType || 'all', audience: 'all',
        publishedAt: new Date(),
        institutionId: (await prisma.institution.findFirst({ orderBy: { createdAt: 'asc' } }))?.id || '',
      },
    });
    return res.status(201).json(ann);
  } catch (error: any) {
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 8. Delete platform announcement
router.delete('/announcements/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.notice.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

export default router;
