// GET /api/admin/students
// Mengembalikan daftar semua mahasiswa + jumlah jawaban + status
// Akses: butuh admin password (X-Admin-Pass header)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SPEAKING_QUESTIONS } from "@/lib/questions";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function GET(req: NextRequest) {
  // Verifikasi admin password
  const adminPass = req.headers.get("x-admin-pass");
  if (adminPass !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Password admin salah." },
      { status: 401 }
    );
  }

  const students = await db.student.findMany({
    orderBy: { nim: "asc" },
    select: {
      id: true,
      nim: true,
      name: true,
      programStudy: true,
      faculty: true,
      courseCode: true,
      courseName: true,
      examStatus: true,
      startedAt: true,
      submittedAt: true,
      answers: {
        select: {
          questionId: true,
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

  const totalQuestions = SPEAKING_QUESTIONS.length;
  const totalMaxScore = SPEAKING_QUESTIONS.reduce((sum, q) => sum + q.points, 0);

  const result = students.map((s) => {
    const totalScore = s.answers.reduce(
      (sum, a) => sum + (a.score ?? 0),
      0
    );
    const scoredCount = s.answers.filter((a) => a.score !== null).length;
    return {
      id: s.id,
      nim: s.nim,
      name: s.name,
      programStudy: s.programStudy,
      faculty: s.faculty,
      courseCode: s.courseCode,
      courseName: s.courseName,
      examStatus: s.examStatus,
      startedAt: s.startedAt,
      submittedAt: s.submittedAt,
      answeredCount: s.answers.length,
      totalQuestions,
      totalDurationSeconds: s.answers.reduce(
        (sum, a) => sum + a.durationSeconds,
        0
      ),
      // Score summary
      totalScore,
      totalMaxScore,
      scoredCount,
      hasScore: scoredCount > 0,
      answers: s.answers.sort((a, b) =>
        a.questionId.localeCompare(b.questionId)
      ),
    };
  });

  return NextResponse.json({
    ok: true,
    total: result.length,
    submitted: result.filter((s) => s.examStatus === "SUBMITTED").length,
    inProgress: result.filter((s) => s.examStatus === "IN_PROGRESS").length,
    notStarted: result.filter((s) => s.examStatus === "NOT_STARTED").length,
    students: result,
    questions: SPEAKING_QUESTIONS.map((q) => ({
      id: q.id,
      sectionNumber: q.sectionNumber,
      sectionTitle: q.sectionTitle,
      title: q.title,
      points: q.points,
      evaluationCriteria: q.evaluationCriteria,
    })),
  });
}
