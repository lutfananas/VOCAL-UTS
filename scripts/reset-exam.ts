import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  // Reset semua status exam ke NOT_STARTED agar siap untuk testing user
  await prisma.examLog.deleteMany();
  await prisma.speakingAnswer.deleteMany();
  await prisma.student.updateMany({
    data: {
      examStatus: "NOT_STARTED",
      startedAt: null,
      submittedAt: null,
    },
  });
  const count = await prisma.student.count();
  console.log(`✅ Reset ${count} students to NOT_STARTED status`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
