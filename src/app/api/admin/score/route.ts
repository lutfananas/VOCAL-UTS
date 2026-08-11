// POST /api/admin/score
// Body: { studentId, questionId, scoreMax, score?, scoreNotes? }
// Simpan / update nilai dosen per jawaban
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SPEAKING_QUESTIONS } from "@/lib/questions";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(req: NextRequest) {
  const adminPass = req.headers.get("x-admin-pass");
  if (adminPass !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  let body: {
    studentId?: string;
    questionId?: string;
    scoreMax?: number;
    score?: number | null;
    scoreNotes?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body request tidak valid." },
      { status: 400 }
    );
  }

  const studentId = String(body?.studentId ?? "");
  const questionId = String(body?.questionId ?? "");
  const scoreMax = Number(body?.scoreMax ?? 0);
  const score = body?.score === null || body?.score === undefined ? null : Number(body.score);
  const scoreNotes =
    body?.scoreNotes === null || body?.scoreNotes === undefined
      ? null
      : String(body.scoreNotes).slice(0, 2000); // max 2000 chars

  if (!studentId || !questionId) {
    return NextResponse.json(
      { ok: false, error: "studentId dan questionId wajib diisi." },
      { status: 400 }
    );
  }

  // Validasi question
  const question = SPEAKING_QUESTIONS.find((q) => q.id === questionId);
  if (!question) {
    return NextResponse.json(
      { ok: false, error: "Soal tidak ditemukan." },
      { status: 404 }
    );
  }

  // Validasi score range
  if (score !== null) {
    if (isNaN(score) || score < 0) {
      return NextResponse.json(
        { ok: false, error: "Nilai harus berupa angka >= 0." },
        { status: 400 }
      );
    }
    if (scoreMax > 0 && score > scoreMax) {
      return NextResponse.json(
        {
          ok: false,
          error: `Nilai (${score}) tidak boleh melebihi nilai maksimum (${scoreMax}).`,
        },
        { status: 400 }
      );
    }
  }

  // Cek apakah jawaban ada
  const existing = await db.speakingAnswer.findUnique({
    where: {
      studentId_questionId: { studentId, questionId },
    },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "Jawaban mahasiswa tidak ditemukan. Mahasiswa belum mengerjakan soal ini." },
      { status: 404 }
    );
  }

  // Update score
  const updated = await db.speakingAnswer.update({
    where: { id: existing.id },
    data: {
      score: score,
      scoreMax: scoreMax || question.points,
      scoreNotes: scoreNotes,
      scoredAt: new Date(),
      scoredBy: "admin",
    },
    select: {
      id: true,
      questionId: true,
      score: true,
      scoreMax: true,
      scoreNotes: true,
      scoredAt: true,
      scoredBy: true,
    },
  });

  return NextResponse.json({
    ok: true,
    score: updated,
  });
}

// GET /api/admin/score?studentId=X&questionId=Y - ambil score untuk 1 jawaban
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
      questionId: true,
      score: true,
      scoreMax: true,
      scoreNotes: true,
      scoredAt: true,
      scoredBy: true,
    },
  });

  if (!answer) {
    return NextResponse.json(
      { ok: false, error: "Jawaban tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, score: answer });
}
