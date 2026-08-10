// POST /api/auth/login
// Body: { nim: string }
// Verifikasi NIM terdaftar di database, buat session
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession, clearSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nim = String(body?.nim ?? "").trim();

    if (!nim) {
      return NextResponse.json(
        { ok: false, error: "NIM wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^\d{6,12}$/.test(nim)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Format NIM tidak valid. NIM harus terdiri dari 6-12 digit angka.",
        },
        { status: 400 }
      );
    }

    const student = await db.student.findUnique({
      where: { nim },
    });

    if (!student) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "NIM tidak terdaftar. Silakan hubungi dosen pengampu jika Anda merasa sudah mendaftar.",
        },
        { status: 404 }
      );
    }

    // Jika sudah SUBMITTED, tolak login baru
    if (student.examStatus === "SUBMITTED") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Anda telah menyelesaikan ujian. Login ulang tidak diizinkan. Hubungi dosen jika perlu reset.",
          alreadySubmitted: true,
          submittedAt: student.submittedAt,
        },
        { status: 403 }
      );
    }

    // Reset session lama lalu buat baru
    await clearSession();
    await setSession({
      studentId: student.id,
      nim: student.nim,
      name: student.name,
      loginAt: Date.now(),
    });

    // Catat log login
    await db.examLog.create({
      data: {
        studentId: student.id,
        action: "LOGIN",
        detail: `NIM ${nim} berhasil login`,
      },
    });

    // Jika status masih NOT_STARTED, ubah ke IN_PROGRESS dan catat startedAt
    if (student.examStatus === "NOT_STARTED") {
      await db.student.update({
        where: { id: student.id },
        data: {
          examStatus: "IN_PROGRESS",
          startedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      ok: true,
      student: {
        id: student.id,
        nim: student.nim,
        name: student.name,
        programStudy: student.programStudy,
        faculty: student.faculty,
        courseCode: student.courseCode,
        courseName: student.courseName,
        examStatus:
          student.examStatus === "NOT_STARTED" ? "IN_PROGRESS" : student.examStatus,
        startedAt:
          student.startedAt ?? new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[login] error", err);
    return NextResponse.json(
      { ok: false, error: "Terjadi kesalahan server. Coba lagi." },
      { status: 500 }
    );
  }
}

// GET /api/auth/me - check session
export async function GET() {
  const { getSession } = await import("@/lib/session");
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, authenticated: false });
  }
  const student = await db.student.findUnique({
    where: { id: session.studentId },
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
    },
  });
  if (!student) {
    return NextResponse.json({ ok: false, authenticated: false });
  }
  return NextResponse.json({ ok: true, authenticated: true, student });
}
