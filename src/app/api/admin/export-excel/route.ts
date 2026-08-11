// GET /api/admin/export-excel?studentId=X (atau ?all=true untuk semua)
// Export data jawaban + nilai ke format Excel (.xlsx)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SPEAKING_QUESTIONS, EXAM_META } from "@/lib/questions";
import * as XLSX from "xlsx";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function checkAuth(req: NextRequest): boolean {
  const headerPass = req.headers.get("x-admin-pass");
  if (headerPass === ADMIN_PASSWORD) return true;
  const { searchParams } = new URL(req.url);
  const queryPass = searchParams.get("p");
  if (queryPass === ADMIN_PASSWORD) return true;
  return false;
}

function fmtDateCell(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const all = searchParams.get("all") === "true";

  if (!studentId && !all) {
    return NextResponse.json(
      { ok: false, error: "Parameter studentId atau all=true wajib diisi." },
      { status: 400 }
    );
  }

  const whereClause = all
    ? { examStatus: "SUBMITTED" as const }
    : { id: studentId! };

  const students = await db.student.findMany({
    where: whereClause,
    orderBy: { nim: "asc" },
    select: {
      id: true,
      nim: true,
      name: true,
      programStudy: true,
      faculty: true,
      examStatus: true,
      startedAt: true,
      submittedAt: true,
      answers: {
        select: {
          questionId: true,
          questionSection: true,
          durationSeconds: true,
          attemptCount: true,
          recordedAt: true,
          score: true,
          scoreMax: true,
          scoreNotes: true,
          scoredAt: true,
          scoredBy: true,
        },
      },
    },
  });

  if (students.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Tidak ada data mahasiswa." },
      { status: 404 }
    );
  }

  // === Buat Workbook Excel ===
  const wb = XLSX.utils.book_new();

  // === Sheet 1: Ringkasan Nilai (semua mahasiswa) ===
  const summaryRows: (string | number)[][] = [];
  // Header info
  summaryRows.push(["LAPORAN NILAI UJIAN SPEAKING CBT"]);
  summaryRows.push([
    `${EXAM_META.title} - Tahun Akademik ${EXAM_META.academicYear} Semester ${EXAM_META.semester}`,
  ]);
  summaryRows.push([
    `Mata Kuliah: ${EXAM_META.courseName} (${EXAM_META.courseCode})`,
  ]);
  summaryRows.push([`Program Studi: ${EXAM_META.programStudy}`]);
  summaryRows.push([`Fakultas: ${EXAM_META.faculty}`]);
  summaryRows.push([`Dosen Penguji: ${EXAM_META.examiner}`]);
  summaryRows.push([`Tanggal Export: ${new Date().toLocaleString("id-ID")}`]);
  summaryRows.push([]);

  // Header kolom
  const headerRow: (string | number)[] = [
    "No",
    "NIM",
    "Nama",
    "Program Studi",
    "Status Ujian",
    "Mulai",
    "Submit",
    "Total Durasi Audio",
    "Jawaban (soal)",
  ];
  // Tambah kolom per section (Q1-Q6)
  SPEAKING_QUESTIONS.forEach((q) => {
    headerRow.push(`Nilai ${q.id} (max ${q.points})`);
  });
  headerRow.push("Catatan " + SPEAKING_QUESTIONS[0].id);
  SPEAKING_QUESTIONS.slice(1).forEach((q) => {
    headerRow.push(`Catatan ${q.id}`);
  });
  headerRow.push("TOTAL NILAI");
  headerRow.push("NILAI MAKS");
  headerRow.push("Persentase (%)");
  headerRow.push("Soal Sudah Dinilai");
  summaryRows.push(headerRow);

  // Data rows
  students.forEach((s, idx) => {
    const row: (string | number)[] = [];
    row.push(idx + 1);
    row.push(s.nim);
    row.push(s.name);
    row.push(s.programStudy);
    row.push(s.examStatus);
    row.push(fmtDateCell(s.startedAt));
    row.push(fmtDateCell(s.submittedAt));
    row.push(fmtDuration(s.answers.reduce((sum, a) => sum + a.durationSeconds, 0)));
    row.push(`${s.answers.length} / ${SPEAKING_QUESTIONS.length}`);

    // Nilai per section
    let totalScore = 0;
    let scoredCount = 0;
    const notesByQ: Record<string, string> = {};

    SPEAKING_QUESTIONS.forEach((q) => {
      const ans = s.answers.find((a) => a.questionId === q.id);
      if (ans) {
        if (ans.score !== null) {
          row.push(ans.score);
          totalScore += ans.score;
          scoredCount++;
        } else {
          row.push("Belum dinilai");
        }
        if (ans.scoreNotes) {
          notesByQ[q.id] = ans.scoreNotes;
        }
      } else {
        row.push("Tidak dijawab");
      }
    });

    // Catatan per section
    SPEAKING_QUESTIONS.forEach((q) => {
      row.push(notesByQ[q.id] ?? "");
    });

    // Total
    const totalMax = SPEAKING_QUESTIONS.reduce((sum, q) => sum + q.points, 0);
    row.push(Number(totalScore.toFixed(2)));
    row.push(totalMax);
    row.push(Number(((totalScore / totalMax) * 100).toFixed(2)));
    row.push(`${scoredCount} / ${SPEAKING_QUESTIONS.length}`);

    summaryRows.push(row);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(summaryRows);
  // Set column widths
  ws1["!cols"] = [
    { wch: 5 },   // No
    { wch: 12 },  // NIM
    { wch: 30 },  // Nama
    { wch: 25 },  // Program Studi
    { wch: 12 },  // Status
    { wch: 18 },  // Mulai
    { wch: 18 },  // Submit
    { wch: 15 },  // Total Durasi
    { wch: 12 },  // Jawaban
    ...SPEAKING_QUESTIONS.map(() => ({ wch: 14 })),  // Nilai Q1-Q6
    ...SPEAKING_QUESTIONS.map(() => ({ wch: 30 })),  // Catatan Q1-Q6
    { wch: 12 },  // Total Nilai
    { wch: 10 },  // Nilai Maks
    { wch: 14 },  // Persentase
    { wch: 15 },  // Sudah Dinilai
  ];
  XLSX.utils.book_append_sheet(wb, ws1, "Ringkasan Nilai");

  // === Sheet 2: Detail per Mahasiswa (hanya jika export per student) ===
  if (!all && students.length === 1) {
    const s = students[0];
    const detailRows: (string | number)[][] = [];
    detailRows.push([`DETAIL PENILAIAN - ${s.name} (${s.nim})`]);
    detailRows.push([`Tahun Akademik ${EXAM_META.academicYear} Semester ${EXAM_META.semester}`]);
    detailRows.push([`Mata Kuliah: ${EXAM_META.courseName} (${EXAM_META.courseCode})`]);
    detailRows.push([`Dosen Penguji: ${EXAM_META.examiner}`]);
    detailRows.push([]);
    detailRows.push(["Data Mahasiswa"]);
    detailRows.push(["NIM", s.nim]);
    detailRows.push(["Nama", s.name]);
    detailRows.push(["Program Studi", s.programStudy]);
    detailRows.push(["Fakultas", s.faculty]);
    detailRows.push(["Status Ujian", s.examStatus]);
    detailRows.push(["Mulai Ujian", fmtDateCell(s.startedAt)]);
    detailRows.push(["Submit Ujian", fmtDateCell(s.submittedAt)]);
    detailRows.push(["Total Durasi Audio", fmtDuration(s.answers.reduce((sum, a) => sum + a.durationSeconds, 0))]);
    detailRows.push([]);

    detailRows.push(["Detail Jawaban per Section"]);
    detailRows.push([
      "Section",
      "Question ID",
      "Judul Soal",
      "Poin Maks",
      "Durasi Rekaman",
      "Percobaan",
      "Waktu Rekam",
      "Nilai",
      "Catatan Dosen",
      "Waktu Penilaian",
      "Dinilai Oleh",
    ]);

    let totalScore = 0;
    let totalMax = 0;
    SPEAKING_QUESTIONS.forEach((q) => {
      const ans = s.answers.find((a) => a.questionId === q.id);
      detailRows.push([
        q.sectionNumber,
        q.id,
        q.title,
        q.points,
        ans ? fmtDuration(ans.durationSeconds) : "-",
        ans ? ans.attemptCount : "-",
        ans ? fmtDateCell(ans.recordedAt) : "-",
        ans ? (ans.score !== null ? ans.score : "Belum dinilai") : "Tidak dijawab",
        ans?.scoreNotes ?? "",
        ans ? fmtDateCell(ans.scoredAt) : "-",
        ans?.scoredBy ?? "-",
      ]);
      totalMax += q.points;
      if (ans?.score !== null && ans?.score !== undefined) {
        totalScore += ans.score;
      }
    });

    detailRows.push([]);
    detailRows.push(["TOTAL NILAI", Number(totalScore.toFixed(2))]);
    detailRows.push(["NILAI MAKSIMUM", totalMax]);
    detailRows.push(["PERSENTASE", Number(((totalScore / totalMax) * 100).toFixed(2)) + "%"]);

    const ws2 = XLSX.utils.aoa_to_sheet(detailRows);
    ws2["!cols"] = [
      { wch: 8 },   // Section
      { wch: 10 },  // QID
      { wch: 50 },  // Judul
      { wch: 10 },  // Poin Maks
      { wch: 14 },  // Durasi
      { wch: 10 },  // Percobaan
      { wch: 18 },  // Waktu Rekam
      { wch: 14 },  // Nilai
      { wch: 40 },  // Catatan
      { wch: 18 },  // Waktu Penilaian
      { wch: 14 },  // Dinilai Oleh
    ];
    XLSX.utils.book_append_sheet(wb, ws2, "Detail Mahasiswa");
  }

  // === Sheet 3: Kriteria Penilaian (referensi) ===
  const criteriaRows: (string | number)[][] = [];
  criteriaRows.push(["KRITERIA PENILAIAN PER SECTION"]);
  criteriaRows.push([]);
  criteriaRows.push([
    "Section",
    "Question ID",
    "Judul Soal",
    "Poin Maks",
    "Kriteria Penilaian",
  ]);
  SPEAKING_QUESTIONS.forEach((q) => {
    q.evaluationCriteria.forEach((c, i) => {
      criteriaRows.push([
        i === 0 ? q.sectionNumber : "",
        i === 0 ? q.id : "",
        i === 0 ? q.title : "",
        i === 0 ? q.points : "",
        c,
      ]);
    });
    criteriaRows.push([]);  // empty row between sections
  });

  const ws3 = XLSX.utils.aoa_to_sheet(criteriaRows);
  ws3["!cols"] = [
    { wch: 8 },
    { wch: 10 },
    { wch: 50 },
    { wch: 10 },
    { wch: 60 },
  ];
  XLSX.utils.book_append_sheet(wb, ws3, "Kriteria Penilaian");

  // === Generate Excel buffer ===
  const excelBuffer = XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx",
    compression: true,
  }) as Buffer;

  const filename = all
    ? `Nilai-CBT-Speaking-${EXAM_META.academicYear.replace("/", "-")}-${EXAM_META.semester}-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    : `Nilai-CBT-Speaking-${students[0].nim}-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

  return new NextResponse(excelBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": excelBuffer.length.toString(),
      "Cache-Control": "private, no-store",
    },
  });
}
