// POST /api/auth/logout
import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export const runtime = 'edge';

export async function POST() {
  const db = await getDb();
  await clearSession();
  return NextResponse.json({ ok: true });
}
