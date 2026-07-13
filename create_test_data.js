const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordAdmin = await bcrypt.hash('schpass123', 10);
  const passwordTeacher = await bcrypt.hash('teachpass123', 10);
  const passwordStudent = await bcrypt.hash('amanpass123', 10);

  // Check if test institution exists
  let inst = await prisma.institution.findUnique({ where: { slug: 'greenwood' } });
  if (!inst) {
    inst = await prisma.institution.create({
      data: {
        name: 'Greenwood High',
        slug: 'greenwood',
        type: 'school',
        plan: 'premium'
      }
    });
  }

  // Admin
  await prisma.user.upsert({
    where: { email: 'sch@greenwood.com' },
    update: { password: passwordAdmin, institutionId: inst.id, isApproved: true },
    create: { name: 'Admin', email: 'sch@greenwood.com', password: passwordAdmin, role: 'school_admin', institutionId: inst.id, isApproved: true }
  });

  // Teacher
  await prisma.user.upsert({
    where: { email: 'pawankumar@school.com' },
    update: { password: passwordTeacher, institutionId: inst.id, isApproved: true },
    create: { name: 'Pawan Kumar', email: 'pawankumar@school.com', password: passwordTeacher, role: 'teacher', institutionId: inst.id, isApproved: true }
  });

  // Student
  await prisma.user.upsert({
    where: { email: 'aman@school.com' },
    update: { password: passwordStudent, institutionId: inst.id, isApproved: true },
    create: { name: 'Aman', email: 'aman@school.com', password: passwordStudent, role: 'student', institutionId: inst.id, isApproved: true }
  });

  console.log("Test data seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
