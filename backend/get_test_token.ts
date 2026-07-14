import jwt from 'jsonwebtoken';
import { env } from './src/config/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Let's create a test institution and test user if they don't exist
  let inst = await prisma.institution.findFirst({ where: { slug: 'test-inst' } });
  if (!inst) {
    inst = await prisma.institution.create({
      data: {
        name: 'Test Institution',
        slug: 'test-inst',
        type: 'school',
        enabledModules: ['mod_face_attendance', 'mod_bus_tracking']
      }
    });
  }

  let user = await prisma.user.findFirst({ where: { email: 'test@example.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'teacher',
        password: 'password', // dummy
        institutionId: inst.id
      }
    });
  }

  // Also create a test driver
  let driver = await prisma.user.findFirst({ where: { email: 'driver@example.com' } });
  if (!driver) {
    driver = await prisma.user.create({
      data: {
        email: 'driver@example.com',
        name: 'Test Driver',
        role: 'teacher', // using teacher just to pass auth roles for now
        password: 'password', // dummy
        institutionId: inst.id
      }
    });
  }

  const token = jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role,
    institutionId: user.institutionId,
    institutionSlug: inst.slug,
  }, env.jwtSecret, { expiresIn: '1h' });

  const driverToken = jwt.sign({
    id: driver.id,
    email: driver.email,
    role: driver.role,
    institutionId: driver.institutionId,
    institutionSlug: inst.slug,
  }, env.jwtSecret, { expiresIn: '1h' });

  // And an admin token for admin routes
  let admin = await prisma.user.findFirst({ where: { email: 'admin@example.com' } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Test Admin',
        role: 'school_admin',
        password: 'password',
        institutionId: inst.id
      }
    });
  }
  const adminToken = jwt.sign({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    institutionId: admin.institutionId,
    institutionSlug: inst.slug,
  }, env.jwtSecret, { expiresIn: '1h' });

  console.log(JSON.stringify({ 
    token, 
    userId: user.id, 
    driverToken, 
    driverId: driver.id,
    adminToken,
    institutionId: inst.id 
  }));
}

main().catch(console.error);
