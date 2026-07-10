import { Router, type Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { type AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// 1. Get profile of the admin's active institution
router.get('/my-institution', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context associated.' });
  }

  try {
    const inst = await prisma.institution.findUnique({
      where: { id: institutionId },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!inst) {
      return res.status(404).json({ error: 'NotFound', message: 'Institution record not found.' });
    }

    return res.status(200).json(inst);
  } catch (error: any) {
    console.error('Fetch active institution details exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 2. Update profiles of their own institution
router.put('/my-institution', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { phone, email, website, address } = req.body;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context associated.' });
  }

  try {
    const updated = await prisma.institution.update({
      where: { id: institutionId },
      data: {
        phone,
        email,
        website,
        address
      }
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    console.error('Update institution details exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 3. List users (students/teachers) or support staff of active institution
router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { role } = req.query;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    if (role === 'support') {
      const support = await prisma.supportStaff.findMany({
        where: { institutionId },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(support);
    } else {
      const dbRole = role === 'teacher' ? 'teacher' : 'student';
      const users = await prisma.user.findMany({
        where: { institutionId, role: dbRole },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(users);
    }
  } catch (error: any) {
    console.error('Fetch users list exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 4. Create a new user (student/teacher) or support staff
router.post('/users', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { role, name, email, password, phone, class: className, section, rollNo, subject, salary, shift, busNumber, fatherName, motherName, address } = req.body;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }
  if (!name || !email) {
    return res.status(400).json({ error: 'ValidationError', message: 'Name and email are required.' });
  }

  try {
    if (role === 'support') {
      const newSupport = await prisma.supportStaff.create({
        data: {
          name,
          email,
          phone: phone || '',
          role: req.body.supportRole || 'guard',
          joiningDate: new Date(),
          salary: Number(salary) || 15000,
          shift: shift || 'morning',
          busNumber: busNumber || null,
          institutionId
        }
      });
      return res.status(201).json(newSupport);
    } else {
      // Check if email already exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: 'ConflictError', message: 'Email address already in use.' });
      }

      // Default password: email username + '123' if not provided
      const defaultPassword = password || (email.split('@')[0] + '123');
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const dbRole = role === 'teacher' ? 'teacher' : role === 'parent' ? 'parent' : 'student';
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          role: dbRole,
          class: className || null,
          section: section || null,
          rollNo: rollNo || null,
          qualification: subject || null,
          fatherName: fatherName || null,
          motherName: motherName || null,
          address: address || null,
          joiningDate: new Date(),
          institutionId
        }
      });
      if (dbRole === 'parent') {
        await prisma.user.updateMany({
          where: {
            institutionId,
            role: 'student',
            parentId: null,
            OR: [{ fatherName: name }, { motherName: name }],
          },
          data: { parentId: newUser.id },
        });
      }
      return res.status(201).json(newUser);
    }
  } catch (error: any) {
    console.error('Create user exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 5. Update user or support staff details
router.put('/users/:id', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { id } = req.params;
  const { role, name, email, password, phone, class: className, section, rollNo, subject, salary, shift, busNumber, fatherName, motherName, address } = req.body;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    if (role === 'support') {
      const updated = await prisma.supportStaff.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          role: req.body.supportRole,
          salary: salary ? Number(salary) : undefined,
          shift,
          busNumber
        }
      });
      return res.status(200).json(updated);
    } else {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          class: className,
          section,
          rollNo,
          qualification: subject,
          fatherName: fatherName !== undefined ? fatherName : undefined,
          motherName: motherName !== undefined ? motherName : undefined,
          address: address !== undefined ? address : undefined,
          ...(password && { password: await bcrypt.hash(password, 10) })
        }
      });
      return res.status(200).json(updated);
    }
  } catch (error: any) {
    console.error('Update user exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 6. Delete a user or support staff
router.delete('/users/:id', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { id } = req.params;
  const { role } = req.query;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    if (role === 'support') {
      await prisma.supportStaff.deleteMany({
        where: { id, institutionId }
      });
    } else {
      await prisma.user.deleteMany({
        where: { id, institutionId }
      });
    }
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    console.error('Delete user exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 7. Get dynamic list of classes and sections by grouping students and matching class teachers
router.get('/classes', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    const students = await prisma.user.findMany({
      where: { institutionId, role: 'student' },
      select: { class: true, section: true }
    });

    const teachers = await prisma.user.findMany({
      where: { institutionId, role: 'teacher' },
      select: { id: true, name: true, class: true, section: true }
    });

    const groupMap: Record<string, { className: string; section: string; totalStudents: number; classTeacherId: string; classTeacher: string }> = {};

    // Seed classes from students
    students.forEach(s => {
      if (s.class && s.section) {
        const key = `${s.class}-${s.section}`;
        if (!groupMap[key]) {
          const matchTeacher = teachers.find(t => t.class === s.class && t.section === s.section);
          groupMap[key] = {
            className: s.class,
            section: s.section,
            totalStudents: 0,
            classTeacherId: matchTeacher ? matchTeacher.id : '',
            classTeacher: matchTeacher ? matchTeacher.name : 'Not Assigned'
          };
        }
        groupMap[key].totalStudents += 1;
      }
    });

    // Seed classes from teachers who have assignments but maybe 0 students
    teachers.forEach(t => {
      if (t.class && t.section) {
        const key = `${t.class}-${t.section}`;
        if (!groupMap[key]) {
          groupMap[key] = {
            className: t.class,
            section: t.section,
            totalStudents: 0,
            classTeacherId: t.id,
            classTeacher: t.name
          };
        }
      }
    });

    const classesList = Object.keys(groupMap).map((key, index) => ({
      id: key,
      className: groupMap[key].className,
      section: groupMap[key].section,
      totalStudents: groupMap[key].totalStudents,
      classTeacherId: groupMap[key].classTeacherId,
      classTeacher: groupMap[key].classTeacher,
      room: 'Main Hall',
      isActive: true
    }));

    return res.status(200).json(classesList);
  } catch (error: any) {
    console.error('Fetch classes exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 8. Create a new class dynamically by assigning a teacher
router.post('/classes', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { className, section, classTeacherId } = req.body;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }
  if (!className || !section) {
    return res.status(400).json({ error: 'ValidationError', message: 'Class name and section are required.' });
  }

  try {
    if (classTeacherId) {
      await prisma.user.update({
        where: { id: classTeacherId },
        data: {
          class: className,
          section: section
        }
      });
    }
    return res.status(201).json({ message: 'Class created dynamically.' });
  } catch (error: any) {
    console.error('Create class exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 9. Update class dynamically (renames class/section value for all associated users)
router.put('/classes/:id', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { id } = req.params;
  const { className, section, classTeacherId } = req.body;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    const parts = id.split('-');
    const oldSection = parts.pop();
    const oldClass = parts.join('-');

    // Update all students
    await prisma.user.updateMany({
      where: { institutionId, role: 'student', class: oldClass, section: oldSection },
      data: { class: className, section: section }
    });

    // Clear old teacher
    await prisma.user.updateMany({
      where: { institutionId, role: 'teacher', class: oldClass, section: oldSection },
      data: { class: null, section: null }
    });

    if (classTeacherId) {
      await prisma.user.update({
        where: { id: classTeacherId },
        data: { class: className, section: section }
      });
    }

    return res.status(200).json({ message: 'Class updated dynamically.' });
  } catch (error: any) {
    console.error('Update class exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 10. Delete class dynamically (removes class/section values for all associated users)
router.delete('/classes/:id', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { id } = req.params;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    const parts = id.split('-');
    const oldSection = parts.pop();
    const oldClass = parts.join('-');

    await prisma.user.updateMany({
      where: { institutionId, role: 'student', class: oldClass, section: oldSection },
      data: { class: null, section: null }
    });

    await prisma.user.updateMany({
      where: { institutionId, role: 'teacher', class: oldClass, section: oldSection },
      data: { class: null, section: null }
    });

    return res.status(200).json({ message: 'Class deleted dynamically.' });
  } catch (error: any) {
    console.error('Delete class exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 11. Get or auto-generate staff payroll records for selected month & year
router.get('/payroll', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const month = (req.query.month as string) || 'July';
  const year = Number(req.query.year) || 2026;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    let payrolls = await prisma.staffPayroll.findMany({
      where: { institutionId, month, year }
    });

    const teachers = await prisma.user.findMany({
      where: { institutionId, role: 'teacher' }
    });
    
    const support = await prisma.supportStaff.findMany({
      where: { institutionId, isActive: true }
    });

    let newEntriesCreated = false;

    // Auto-generate for teachers
    for (const t of teachers) {
      const hasEntry = payrolls.some(p => p.staffId === t.id);
      if (!hasEntry) {
        await prisma.staffPayroll.create({
          data: {
            staffId: t.id,
            staffName: t.name,
            role: 'teacher',
            basicSalary: 45000,
            netSalary: 45000,
            month,
            year,
            status: 'pending',
            institutionId
          }
        });
        newEntriesCreated = true;
      }
    }

    // Auto-generate for support staff
    for (const s of support) {
      const hasEntry = payrolls.some(p => p.staffId === s.id);
      if (!hasEntry) {
        await prisma.staffPayroll.create({
          data: {
            staffId: s.id,
            staffName: s.name,
            role: s.role,
            basicSalary: s.salary,
            netSalary: s.salary,
            month,
            year,
            status: 'pending',
            institutionId
          }
        });
        newEntriesCreated = true;
      }
    }

    if (newEntriesCreated) {
      payrolls = await prisma.staffPayroll.findMany({
        where: { institutionId, month, year }
      });
    }

    return res.status(200).json(payrolls);
  } catch (error: any) {
    console.error('Fetch payroll exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 12. Process salary payment for a specific payroll record
router.put('/payroll/:id/pay', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { id } = req.params;
  const { paymentMethod } = req.body;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    const updated = await prisma.staffPayroll.update({
      where: { id },
      data: {
        status: 'paid',
        paidOn: new Date(),
        paymentMethod: paymentMethod || 'bank_transfer'
      }
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    console.error('Pay salary exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 13. Pay all pending staff salaries for selected month & year
router.put('/payroll/pay-all', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { month, year, paymentMethod } = req.body;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }
  if (!month || !year) {
    return res.status(400).json({ error: 'ValidationError', message: 'Month and year are required.' });
  }

  try {
    const result = await prisma.staffPayroll.updateMany({
      where: {
        institutionId,
        month,
        year: Number(year),
        status: 'pending'
      },
      data: {
        status: 'paid',
        paidOn: new Date(),
        paymentMethod: paymentMethod || 'bank_transfer'
      }
    });

    return res.status(200).json({ message: `Successfully paid ${result.count} staff members.`, count: result.count });
  } catch (error: any) {
    console.error('Pay all salaries exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 21. Get pending enrollment requests
router.get('/enrollment-requests', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    const pendings = await prisma.user.findMany({
      where: {
        institutionId,
        role: 'student',
        isApproved: false
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = pendings.map(p => ({
      id: p.id,
      studentName: p.name,
      email: p.email,
      class: p.class || 'Not Assigned',
      date: p.createdAt.toISOString().split('T')[0],
      status: 'pending'
    }));

    return res.status(200).json(formatted);
  } catch (error: any) {
    console.error('Fetch enrollment requests exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 22. Approve enrollment request
router.put('/enrollment-requests/:id/approve', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { id } = req.params;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { isApproved: true }
    });

    return res.status(200).json({ message: 'Enrollment approved successfully.', user: updated });
  } catch (error: any) {
    console.error('Approve enrollment request exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 23. Reject/Delete enrollment request
router.delete('/enrollment-requests/:id', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { id } = req.params;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    await prisma.user.delete({
      where: { id }
    });

    return res.status(200).json({ message: 'Enrollment rejected and profile deleted successfully.' });
  } catch (error: any) {
    console.error('Reject enrollment request exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// --- PARENT COMMUNICATION ENDPOINTS (PHASE 4) ---

// 24. Get all parent communication messages
router.get('/parent-messages', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    const messages = await prisma.parentMessage.findMany({
      where: { institutionId },
      orderBy: { createdAt: 'desc' }
    });

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
  } catch (error: any) {
    console.error('Admin fetch parent messages exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 25. Admin posts alert message to a parent
router.post('/parent-messages', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const adminId = req.user?.id;
  const { studentId, parentName, subject, body, category, priority, isBroadcast, classId } = req.body;

  if (!institutionId || !adminId) {
    return res.status(400).json({ error: 'ContextMissing', message: 'No active admin or institution context.' });
  }
  if (!studentId || !parentName || !subject || !body) {
    return res.status(400).json({ error: 'ValidationError', message: 'studentId, parentName, subject and body are required.' });
  }

  try {
    const newMessage = await prisma.parentMessage.create({
      data: {
        teacherId: 'admin', // Admin sender marker
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
  } catch (error: any) {
    console.error('Admin create parent message exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

// 26. Admin deletes/dismisses parent communication message
router.delete('/parent-messages/:id', async (req: AuthenticatedRequest, res: Response) => {
  const institutionId = req.institutionId;
  const { id } = req.params;

  if (!institutionId) {
    return res.status(400).json({ error: 'TenantContextMissing', message: 'No active institution context.' });
  }

  try {
    await prisma.parentMessage.delete({
      where: { id }
    });
    return res.status(200).json({ message: 'Parent communication log deleted successfully.' });
  } catch (error: any) {
    console.error('Admin delete parent message exception:', error);
    return res.status(500).json({ error: 'InternalError', message: error.message });
  }
});

export default router;
