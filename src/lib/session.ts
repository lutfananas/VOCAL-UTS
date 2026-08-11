// Server-side session helper untuk autentikasi NIM
// Disimpan di cookie (HttpOnly) untuk keamanan
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";

export const SESSION_COOKIE = "cbt_speaking_session";

export interface SessionData {
  studentId: string;
  nim: string;
  name: string;
  loginAt: number;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionData;
    // Verify student still exists and hasn't been deleted
    const db = await getDb();
    const student = await db.student.findUnique({
      where: { id: parsed.studentId },
      select: { id: true, nim: true, name: true, examStatus: true },
    });
    if (!student) return null;
    return {
      ...parsed,
      nim: student.nim,
      name: student.name,
    };
  } catch {
    return null;
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(data), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 jam (cukup untuk ujian)
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
