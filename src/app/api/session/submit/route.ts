// POST /api/session/submit - finalisasi ujian
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { SPEAKING_QUESTIONS } from "@/lib/questions";

export const runtime = 'edge';

export async function POST() {
  const db = await getDb();
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  const student = await db.student.findUnique({
    where: { id: session.studentId },
    select: { id: true, nim: true, name: true, examStatus: true },
  });

  if (!student) {
    return NextResponse.json(
      { ok: false, error: "Mahasiswa tidak ditemukan." },
      { status: 404 }
    );
  }

  if (student.examStatus === "SUBMITTED") {
    return NextResponse.json(
      {
        ok: false,
        error: "Ujian sudah pernah disubmit.",
        alreadySubmitted: true,
      },
      { status: 400 }
    );
  }

  // Cek kelengkapan jawaban
  const answers = await db.speakingAnswer.findMany({
    where: { studentId: student.id },
    select: {
      questionId: true,
      durationSeconds: true,
      attemptCount: true,
      recordedAt: true,
    },
  });

  const answeredIds = new Set(answers.map((a) => a.questionId));
  const missing = SPEAKING_QUESTIONS.filter(
    (q) => !answeredIds.has(q.id)
  ).map((q) => q.id);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: `Masih ada ${missing.length} soal yang belum dijawab: ${missing.join(
          ", "
        )}. Selesaikan semua soal sebelum submit.`,
        missing,
      },
      { status: 400 }
    );
  }

  // Finalisasi
  const updated = await db.student.update({
    where: { id: student.id },
    data: {
      examStatus: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  await db.examLog.create({
    data: {
      studentId: student.id,
      action: "SUBMIT",
      detail: `Ujian speaking disubmit. Total ${answers.length} jawaban.`,
    },
  });

  // Hitung total durasi jawaban
  const totalDuration = answers.reduce(
    (sum, a) => sum + a.durationSeconds,
    0
  );

  return NextResponse.json({
    ok: true,
    submittedAt: updated.submittedAt,
    summary: {
      totalQuestions: answers.length,
      totalDurationSeconds: totalDuration,
      answers: answers.map((a) => ({
        questionId: a.questionId,
        durationSeconds: a.durationSeconds,
        attemptCount: a.attemptCount,
        recordedAt: a.recordedAt,
      })),
    },
  });
}
