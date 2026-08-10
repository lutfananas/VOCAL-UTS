// GET /api/questions
// Mengembalikan daftar soal speaking beserta metadata ujian
// Hanya untuk peserta yang sudah login
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { SPEAKING_QUESTIONS, EXAM_META } from "@/lib/questions";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Silakan login terlebih dahulu." },
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
      { ok: false, error: "Data mahasiswa tidak ditemukan." },
      { status: 404 }
    );
  }

  // Ambil jawaban yang sudah ada (untuk resume)
  const existingAnswers = await db.speakingAnswer.findMany({
    where: { studentId: student.id },
    select: {
      questionId: true,
      durationSeconds: true,
      attemptCount: true,
      recordedAt: true,
    },
  });

  const answeredMap = new Map(
    existingAnswers.map((a) => [a.questionId, a])
  );

  const questionsWithStatus = SPEAKING_QUESTIONS.map((q) => {
    const ans = answeredMap.get(q.id);
    return {
      id: q.id,
      sectionNumber: q.sectionNumber,
      sectionTitle: q.sectionTitle,
      type: q.type,
      title: q.title,
      scenario: q.scenario,
      instruction: q.instruction,
      preparationTimeSec: q.preparationTimeSec,
      recordingTimeSec: q.recordingTimeSec,
      minDurationSec: q.minDurationSec,
      points: q.points,
      evaluationCriteria: q.evaluationCriteria,
      tips: q.tips,
      readingText: q.readingText,
      promptText: q.promptText,
      informalSentences: q.informalSentences,
      guidingQuestions: q.guidingQuestions,
      answered: !!ans,
      answerMeta: ans
        ? {
            durationSeconds: ans.durationSeconds,
            attemptCount: ans.attemptCount,
            recordedAt: ans.recordedAt,
          }
        : null,
    };
  });

  return NextResponse.json({
    ok: true,
    examMeta: EXAM_META,
    student,
    questions: questionsWithStatus,
  });
}
