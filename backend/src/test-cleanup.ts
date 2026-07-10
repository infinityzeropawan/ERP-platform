import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Purging previous test databases and users...');
  
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          'sch@greenwood.com',
          'coach@allen.com',
          'coll@iit.com',
          'admin@greenwoodtest.com',
          'admin@allentest.com',
          'admin@iittest.com',
          'pawankumar@school.com',
          'aman@school.com',
          'ram@school.com',
          'selfregistered@student.com'
        ]
      }
    }
  });

  const deletedSupport = await prisma.supportStaff.deleteMany({
    where: {
      email: {
        in: ['ram@school.com']
      }
    }
  });

  const deletedInsts = await prisma.institution.deleteMany({
    where: {
      slug: {
        in: [
          'sch-greenwood',
          'coach-allen',
          'coll-iit',
          'greenwood-test',
          'allen-test',
          'iit-test'
        ]
      }
    }
  });

  const deletedDiaries = await prisma.dailyDiary.deleteMany({});
  const deletedGrades = await prisma.gradebookEntry.deleteMany({});
  const deletedPayrolls = await prisma.staffPayroll.deleteMany({});
  const deletedParentMsgs = await prisma.parentMessage.deleteMany({});

  console.log(`✅ Cleaned up: ${deletedUsers.count} users, ${deletedSupport.count} support staff, ${deletedInsts.count} institutions, ${deletedDiaries.count} diaries, ${deletedGrades.count} grades, ${deletedPayrolls.count} payrolls, ${deletedParentMsgs.count} parent messages.`);
}

main()
  .catch(err => {
    console.error('Test cleanup failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
