// GET /api/admin/answers/audio?studentId=X&questionId=Y&p=PASSWORD
// Stream audio jawaban untuk diputar di browser
// Password bisa via header (x-admin-pass) atau query param (p) untuk <audio> element
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = 'edge';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function checkAuth(req: NextRequest): boolean {
  // Cek header dulu
  const headerPass = req.headers.get("x-admin-pass");
  if (headerPass === ADMIN_PASSWORD) return true;
  // Fallback ke query param (untuk <audio> element yang tidak bisa set header)
  const { searchParams } = new URL(req.url);
  const queryPass = searchParams.get("p");
  if (queryPass === ADMIN_PASSWORD) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const db = await getDb();
  if (!checkAuth(req)) {
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
      audioData: true,
      audioMimeType: true,
      durationSeconds: true,
    },
  });

  if (!answer || !answer.audioData) {
    return NextResponse.json(
      { ok: false, error: "Audio tidak ditemukan." },
      { status: 404 }
    );
  }

  // Decode base64 to bytes
  const audioBytes = Buffer.from(answer.audioData, "base64");

  return new NextResponse(audioBytes, {
    status: 200,
    headers: {
      "Content-Type": answer.audioMimeType || "audio/webm",
      "Content-Length": audioBytes.length.toString(),
      "Content-Disposition": `inline; filename="${questionId}.webm"`,
      "Cache-Control": "private, no-store",
    },
  });
}

// HEAD untuk cek apakah audio ada (tanpa download full)
export async function HEAD(req: NextRequest) {
  const db = await getDb();
  if (!checkAuth(req)) {
    return new NextResponse(null, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const questionId = searchParams.get("questionId");

  if (!studentId || !questionId) {
    return new NextResponse(null, { status: 400 });
  }

  const answer = await db.speakingAnswer.findUnique({
    where: {
      studentId_questionId: { studentId, questionId },
    },
    select: { id: true },
  });

  return new NextResponse(null, { status: answer ? 200 : 404 });
}
