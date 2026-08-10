// POST /api/answers
// Body: { questionId, audioData (base64), durationSeconds, mimeType }
// Simpan / update jawaban speaking mahasiswa
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { SPEAKING_QUESTIONS } from "@/lib/questions";

const MAX_AUDIO_MB = 15; // batas ukuran audio per soal

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  const student = await db.student.findUnique({
    where: { id: session.studentId },
    select: { id: true, examStatus: true, nim: true, name: true },
  });

  if (!student) {
    return NextResponse.json(
      { ok: false, error: "Data mahasiswa tidak ditemukan." },
      { status: 404 }
    );
  }

  if (student.examStatus === "SUBMITTED") {
    return NextResponse.json(
      {
        ok: false,
        error: "Ujian sudah Anda submit. Tidak dapat menambah jawaban lagi.",
      },
      { status: 403 }
    );
  }

  let body: {
    questionId?: string;
    audioData?: string;
    durationSeconds?: number;
    mimeType?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body request tidak valid." },
      { status: 400 }
    );
  }

  const questionId = String(body?.questionId ?? "");
  const audioData = String(body?.audioData ?? "");
  const durationSeconds = Number(body?.durationSeconds ?? 0);
  const mimeType = String(body?.mimeType ?? "audio/webm");

  const question = SPEAKING_QUESTIONS.find((q) => q.id === questionId);
  if (!question) {
    return NextResponse.json(
      { ok: false, error: "Soal tidak ditemukan." },
      { status: 404 }
    );
  }

  if (!audioData || audioData.length < 100) {
    return NextResponse.json(
      { ok: false, error: "Audio rekaman tidak valid atau kosong." },
      { status: 400 }
    );
  }

  // Hitung ukuran audio (base64 -> bytes)
  const audioBytes = Math.ceil((audioData.length * 3) / 4);
  const audioMB = audioBytes / (1024 * 1024);
  if (audioMB > MAX_AUDIO_MB) {
    return NextResponse.json(
      {
        ok: false,
        error: `Ukuran audio (${audioMB.toFixed(
          2
        )} MB) melebihi batas maksimum ${MAX_AUDIO_MB} MB. Silakan rekam ulang dengan durasi lebih singkat.`,
      },
      { status: 413 }
    );
  }

  if (durationSeconds < question.minDurationSec) {
    return NextResponse.json(
      {
        ok: false,
        error: `Durasi rekaman (${durationSeconds.toFixed(
          0
        )} detik) belum mencapai minimum (${question.minDurationSec} detik). Silakan rekam ulang dengan durasi yang lebih panjang.`,
      },
      { status: 400 }
    );
  }

  if (durationSeconds > question.recordingTimeSec + 5) {
    return NextResponse.json(
      {
        ok: false,
        error: `Durasi rekaman (${durationSeconds.toFixed(
          0
        )} detik) melebihi batas maksimum (${question.recordingTimeSec} detik).`,
      },
      { status: 400 }
    );
  }

  // Cek apakah sudah ada jawaban (jika ya, ini adalah re-record)
  const existing = await db.speakingAnswer.findUnique({
    where: {
      studentId_questionId: {
        studentId: student.id,
        questionId,
      },
    },
  });

  const attemptCount = (existing?.attemptCount ?? 0) + 1;

  // Catat log re-record / record pertama
  await db.examLog.create({
    data: {
      studentId: student.id,
      action: existing ? "RE_RECORD" : "RECORD_STOP",
      detail: `Question ${questionId} | attempt #${attemptCount} | ${durationSeconds.toFixed(
        1
      )}s | ${audioMB.toFixed(2)}MB`,
    },
  });

  if (attemptCount > 3) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Anda telah melebihi batas maksimum 3 percobaan rekaman untuk soal ini. Jawaban terakhir yang tersimpan akan digunakan.",
      },
      { status: 403 }
    );
  }

  // Upsert jawaban
  const answer = await db.speakingAnswer.upsert({
    where: {
      studentId_questionId: {
        studentId: student.id,
        questionId,
      },
    },
    create: {
      studentId: student.id,
      questionId,
      questionSection: question.sectionTitle,
      audioData,
      audioMimeType: mimeType,
      durationSeconds,
      attemptCount,
    },
    update: {
      audioData,
      audioMimeType: mimeType,
      durationSeconds,
      attemptCount,
      recordedAt: new Date(),
    },
  });

  return NextResponse.json({
    ok: true,
    answer: {
      id: answer.id,
      questionId: answer.questionId,
      durationSeconds: answer.durationSeconds,
      attemptCount: answer.attemptCount,
      recordedAt: answer.recordedAt,
    },
  });
}
