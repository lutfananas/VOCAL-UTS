// GET /api/session/status - cek status ujian mahasiswa
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { SPEAKING_QUESTIONS } from "@/lib/questions";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, authenticated: false },
      { status: 401 }
    );
  }

  const student = await db.student.findUnique({
    where: { id: session.studentId },
    select: {
      id: true,
      nim: true,
      name: true,
      examStatus: true,
      startedAt: true,
      submittedAt: true,
    },
  });

  if (!student) {
    return NextResponse.json(
      { ok: false, error: "Mahasiswa tidak ditemukan." },
      { status: 404 }
    );
  }

  const totalQuestions = SPEAKING_QUESTIONS.length;
  const answers = await db.speakingAnswer.findMany({
    where: { studentId: student.id },
    select: { questionId: true, durationSeconds: true, attemptCount: true },
  });

  const answeredQuestions = answers.length;
  const requiredAnswered = answers.length; // semua soal wajib

  return NextResponse.json({
    ok: true,
    student,
    progress: {
      total: totalQuestions,
      answered: answeredQuestions,
      remaining: totalQuestions - answeredQuestions,
      canSubmit: answeredQuestions === totalQuestions,
      answers: answers.map((a) => ({
        questionId: a.questionId,
        durationSeconds: a.durationSeconds,
        attemptCount: a.attemptCount,
      })),
    },
  });
}
