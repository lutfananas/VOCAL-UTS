// Seed script: daftarkan 30 NIM mahasiswa untuk ujian speaking CBT
// Kolaborasi S1 Administrasi Publik UNITA & S1 PGSD UBHI
// - 15 mahasiswa dari UNITA (NIM awalan 2201001xx)
// - 15 mahasiswa dari UBHI (NIM awalan 2202001xx)
// Jalankan: bun run scripts/seed-students.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STUDENTS: Array<{ nim: string; name: string; programStudy: string; faculty: string; courseCode: string; courseName: string }> = [
  // === S1 Administrasi Publik - UNITA (Universitas Tulungagung) ===
  { nim: "220100101", name: "Ahmad Fauzi Rahman", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100102", name: "Siti Nurhaliza Putri", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100103", name: "Budi Santoso Wibowo", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100104", name: "Dewi Lestari Anggraini", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100105", name: "Rizki Pratama Adi", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100106", name: "Nabila Az-Zahra Hakim", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100107", name: "Fajar Nugroho Saputro", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100108", name: "Indah Permatasari Dewi", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100109", name: "Muhammad Iqbal Firdaus", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100110", name: "Putri Ayu Lestari", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100111", name: "Andi Mappangara Akbar", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100112", name: "Ratna Sari Melati", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100113", name: "Yusuf Hamzah Mahendra", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100114", name: "Fitri Handayani Sari", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220100115", name: "Bagus Setiawan Pratama", programStudy: "S1 Administrasi Publik - UNITA", faculty: "FISIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  // === S1 PGSD - UBHI (Universitas Bhinneka PGRI) ===
  { nim: "220200101", name: "Citra Ayu Pratiwi", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200102", name: "Dimas Aryo Wibisono", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200103", name: "Eka Putri Rahmawati", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200104", name: "Fajar Bayu Setiawan", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200105", name: "Gita Maharani Putri", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200106", name: "Hadi Pranata Wijaya", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200107", name: "Indra Kusuma Atmaja", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200108", name: "Joko Susilo Utomo", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200109", name: "Kartika Sari Dewi", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200110", name: "Lukman Hakim Pradana", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200111", name: "Mega Wulandari Ayu", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200112", name: "Nanda Pratama Putra", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200113", name: "Okta Viani Lestari", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200114", name: "Pandu Raga Saputra", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
  { nim: "220200115", name: "Qori Amalia Zahra", programStudy: "S1 PGSD - UBHI", faculty: "FKIP", courseCode: "UTW2002", courseName: "Bahasa Inggris Bisnis" },
];

async function main() {
  console.log("🌱 Seeding database with registered students...");
  console.log(`   - ${STUDENTS.filter((s) => s.programStudy.includes("UNITA")).length} mahasiswa S1 Adpub UNITA`);
  console.log(`   - ${STUDENTS.filter((s) => s.programStudy.includes("UBHI")).length} mahasiswa S1 PGSD UBHI`);
  console.log("");

  // Clean up existing data
  await prisma.examLog.deleteMany();
  await prisma.speakingAnswer.deleteMany();
  await prisma.student.deleteMany();

  for (const s of STUDENTS) {
    await prisma.student.create({
      data: {
        nim: s.nim,
        name: s.name,
        programStudy: s.programStudy,
        faculty: s.faculty,
        courseCode: s.courseCode,
        courseName: s.courseName,
        examStatus: "NOT_STARTED",
      },
    });
  }

  console.log(`✅ Seeded ${STUDENTS.length} students.`);
  console.log("\n📋 Daftar NIM terdaftar (untuk testing):");
  console.log("\n  === S1 Administrasi Publik - UNITA ===");
  STUDENTS.filter((s) => s.programStudy.includes("UNITA")).forEach((s) => {
    console.log(`   ${s.nim} - ${s.name}`);
  });
  console.log("\n  === S1 PGSD - UBHI ===");
  STUDENTS.filter((s) => s.programStudy.includes("UBHI")).forEach((s) => {
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
