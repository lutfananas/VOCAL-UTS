// GET /api/admin/export?studentId=X (atau ?all=true untuk semua)
// Export jawaban sebagai JSON (metadata + base64 audio)
// Untuk dosen yang ingin download data lengkap
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SPEAKING_QUESTIONS } from "@/lib/questions";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function GET(req: NextRequest) {
  const adminPass = req.headers.get("x-admin-pass");
  if (adminPass !== ADMIN_PASSWORD) {
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
          audioData: true,
          audioMimeType: true,
          durationSeconds: true,
          attemptCount: true,
          recordedAt: true,
          // Score fields
          score: true,
          scoreMax: true,
          scoreNotes: true,
          scoredAt: true,
          scoredBy: true,
        },
      },
    },
  });

  // Format untuk export
  const exportData = students.map((s) => {
    const totalScore = s.answers.reduce(
      (sum, a) => sum + (a.score ?? 0),
      0
    );
    const totalMaxScore = SPEAKING_QUESTIONS.reduce(
      (sum, q) => sum + q.points,
      0
    );
    return {
      student: {
        nim: s.nim,
        name: s.name,
        programStudy: s.programStudy,
        faculty: s.faculty,
        examStatus: s.examStatus,
        startedAt: s.startedAt,
        submittedAt: s.submittedAt,
        // Score summary
        totalScore: totalScore.toFixed(2),
        totalMaxScore,
        scoredCount: s.answers.filter((a) => a.score !== null).length,
        totalQuestions: SPEAKING_QUESTIONS.length,
      },
      answers: SPEAKING_QUESTIONS.map((q) => {
        const ans = s.answers.find((a) => a.questionId === q.id);
        return {
          questionId: q.id,
          sectionTitle: q.sectionTitle,
          title: q.title,
          points: q.points,
          hasAnswer: !!ans,
          durationSeconds: ans?.durationSeconds ?? 0,
          attemptCount: ans?.attemptCount ?? 0,
          recordedAt: ans?.recordedAt ?? null,
          audioBase64: ans?.audioData ?? null,
          audioMimeType: ans?.audioMimeType ?? null,
          // Score
          score: ans?.score ?? null,
          scoreMax: ans?.scoreMax ?? q.points,
          scoreNotes: ans?.scoreNotes ?? null,
          scoredAt: ans?.scoredAt ?? null,
          scoredBy: ans?.scoredBy ?? null,
        };
      }),
    };
  });

  const filename = all
    ? `cbt-speaking-all-${new Date().toISOString().slice(0, 10)}.json`
    : `cbt-speaking-${students[0]?.nim ?? "unknown"}.json`;

  const jsonStr = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      examMeta: {
        title: "UJIAN SPEAKING CBT",
        courseCode: "UTW2002",
        courseName: "Bahasa Inggris Bisnis",
        academicYear: "2025/2026",
        examiner: "Prof. Dr. Dwi Ima Herminingsih, M.Hum",
      },
      totalStudents: exportData.length,
      students: exportData,
    },
    null,
    2
  );

  return new NextResponse(jsonStr, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
