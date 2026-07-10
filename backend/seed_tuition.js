const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const hashedPasswordAdmin = await bcrypt.hash('tuitionpass123', 10);
    const hashedPasswordTeacher = await bcrypt.hash('teacherpass123', 10);
    const hashedPasswordStudent = await bcrypt.hash('studentpass123', 10);

    let institution = await prisma.institution.findUnique({ where: { slug: "tuit-maths" } });
    if (!institution) {
        institution = await prisma.institution.create({
            data: {
                name: "Maths Tuition Centre",
                slug: "tuit-maths",
                type: "tuition",
                plan: "pro",
                status: "active",
                enabledModules: ["mod_student_dir","mod_fee_management","mod_attendance","mod_messaging","mod_online_classes","mod_transport","mod_library","mod_timetable","mod_exams","mod_ai_tools"]
            }
        });
    }

    // Delete existing users to avoid unique constraint on email
    await prisma.user.deleteMany({
        where: {
            email: {
                in: ["admin@tuition.com", "teacher@tuition.com", "student@tuition.com"]
            }
        }
    });

    await prisma.user.create({
        data: {
            name: "Tuition Admin",
            email: "admin@tuition.com",
            password: hashedPasswordAdmin,
            role: "school_admin",
            institutionId: institution.id
        }
    });

    await prisma.user.create({
        data: {
            name: "Tuition Teacher",
            email: "teacher@tuition.com",
            password: hashedPasswordTeacher,
            role: "teacher",
            institutionId: institution.id
        }
    });

    await prisma.user.create({
        data: {
            name: "Tuition Student",
            email: "student@tuition.com",
            password: hashedPasswordStudent,
            role: "student",
            institutionId: institution.id
        }
    });
    console.log("Successfully seeded Tuition center!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
