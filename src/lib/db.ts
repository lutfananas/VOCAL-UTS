import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

// Local development Prisma client (SQLite file)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const localPrisma =
  globalForPrisma.prisma ??
  (globalForPrisma.prisma = new PrismaClient({ log: ["error", "warn"] }));

// Detect Cloudflare environment (edge runtime with caches global)
function detectCloudflare(): boolean {
  try {
    return (
      typeof caches !== "undefined" &&
      typeof (globalThis as { caches?: unknown }).caches !== "undefined"
    );
  } catch {
    return false;
  }
}

const isCloudflare = detectCloudflare();

// Cache D1-backed client (per isolate - next-on-pages reuses isolate)
let cachedD1Client: PrismaClient | null = null;

async function getD1Client(): Promise<PrismaClient> {
  if (cachedD1Client) return cachedD1Client;
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const ctx = getRequestContext();
    if (ctx?.env?.DB) {
      const adapter = new PrismaD1(ctx.env.DB as D1Database);
      cachedD1Client = new PrismaClient({ adapter });
      return cachedD1Client;
    }
  } catch {
    // fall through
  }
  return localPrisma;
}

/**
 * Get Prisma client for current context.
 * - In Cloudflare Pages: returns D1-backed Prisma client
 * - In local dev: returns SQLite file-backed Prisma client
 *
 * MUST be awaited before use.
 *
 * Example:
 *   import { getDb } from "@/lib/db";
 *   const db = await getDb();
 *   const students = await db.student.findMany();
 */
export async function getDb(): Promise<PrismaClient> {
  if (isCloudflare) {
    return getD1Client();
  }
  return localPrisma;
}

// For local dev compatibility: export `db` that works synchronously
// WARNING: This only works in local dev. In Cloudflare, you MUST use getDb().
export const db = localPrisma;
