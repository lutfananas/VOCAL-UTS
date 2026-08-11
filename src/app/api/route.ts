import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ message: "Hello, world!" });
}