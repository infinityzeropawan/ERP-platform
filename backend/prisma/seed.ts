import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPERADMIN_EMAIL || 'superadmin@buildroonix.com';
  const plainPassword = process.env.SUPERADMIN_PASSWORD;

  if (!plainPassword) {
    console.error('\n❌  SUPERADMIN_PASSWORD environment variable is not set.');
    console.error('    Set it in your .env file before running this seed.\n');
    process.exit(1);
  }

  if (plainPassword.length < 12) {
    console.error('\n❌  SUPERADMIN_PASSWORD must be at least 12 characters long.\n');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log(`✅  Super Admin [${email}] already exists — skipping creation.`);
    return;
  }

  const superAdmin = await prisma.user.create({
    data: {
      name: process.env.SUPERADMIN_NAME || 'Super Admin',
      email,
      password: hashedPassword,
      role: 'superadmin',
    }
  });

  console.log(`✅  Super Admin created:`);
  console.log(`    Email: ${superAdmin.email}`);
  console.log(`    Role:  ${superAdmin.role}`);
  console.log(`    ID:    ${superAdmin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
