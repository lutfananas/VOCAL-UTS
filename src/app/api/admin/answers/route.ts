// GET /api/admin/answers?studentId=X&questionId=Y
// Mengembalikan metadata jawaban (tanpa audio data, untuk preview info)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
  const questionId = searchParams.get("questionId");

  if (!studentId || !questionId) {
    return NextResponse.json(
      { ok: false, error: "studentId dan questionId wajib diisi." },
      { status: 400 }
    );
  }

  const answer = await db.speakingAnswer.findUnique({
    where: {
      studentId_questionId: { studentId, questionId },
    },
    select: {
      id: true,
      questionId: true,
      questionSection: true,
      durationSeconds: true,
      attemptCount: true,
      recordedAt: true,
      audioMimeType: true,
    },
  });

  if (!answer) {
    return NextResponse.json(
      { ok: false, error: "Jawaban tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, answer });
}
