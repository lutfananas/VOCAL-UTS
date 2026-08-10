// Seed script: daftarkan 25 NIM mahasiswa untuk ujian speaking CBT
// Jalankan: bun run db:seed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STUDENTS = [
  { nim: "220100101", name: "Ahmad Fauzi Rahman" },
  { nim: "220100102", name: "Siti Nurhaliza Putri" },
  { nim: "220100103", name: "Budi Santoso Wibowo" },
  { nim: "220100104", name: "Dewi Lestari Anggraini" },
  { nim: "220100105", name: "Rizki Pratama Adi" },
  { nim: "220100106", name: "Nabila Az-Zahra Hakim" },
  { nim: "220100107", name: "Fajar Nugroho Saputro" },
  { nim: "220100108", name: "Indah Permatasari Dewi" },
  { nim: "220100109", name: "Muhammad Iqbal Firdaus" },
  { nim: "220100110", name: "Putri Ayu Lestari" },
  { nim: "220100111", name: "Andi Mappangara Akbar" },
  { nim: "220100112", name: "Ratna Sari Melati" },
  { nim: "220100113", name: "Yusuf Hamzah Mahendra" },
  { nim: "220100114", name: "Fitri Handayani Sari" },
  { nim: "220100115", name: "Bagus Setiawan Pratama" },
  { nim: "220100116", name: "Anisa Rahmawati Putri" },
  { nim: "220100117", name: "Hendra Wijaya Kusuma" },
  { nim: "220100118", name: "Maya Sari Wulandari" },
  { nim: "220100119", name: "Reza Pahlevi Ramadhan" },
  { nim: "220100120", name: "Sri Wahyuni Utami" },
  { nim: "220100121", name: "Galih Saputra Nugroho" },
  { nim: "220100122", name: "Lia Marlina Siburian" },
  { nim: "220100123", name: "Tegar Aulia Rahman" },
  { nim: "220100124", name: "Wulan Dari Andini" },
  { nim: "220100125", name: "Zaki Mubarak Hidayat" },
];

async function main() {
  console.log("🌱 Seeding database with registered students...");

  // Clean up existing data
  await prisma.examLog.deleteMany();
  await prisma.speakingAnswer.deleteMany();
  await prisma.student.deleteMany();

  for (const s of STUDENTS) {
    await prisma.student.create({
      data: {
        nim: s.nim,
        name: s.name,
        programStudy: "S1 Administrasi Publik",
        faculty: "FISIP",
        courseCode: "UTW2002",
        courseName: "Bahasa Inggris Bisnis",
        examStatus: "NOT_STARTED",
      },
    });
  }

  console.log(`✅ Seeded ${STUDENTS.length} students.`);
  console.log("\n📋 Daftar NIM terdaftar (untuk testing):");
  STUDENTS.forEach((s) => {
    console.log(`   ${s.nim} - ${s.name}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
