// Type definitions for Cloudflare Pages environment
// D1 database binding

interface CloudflareEnv {
  DB: D1Database;
  ADMIN_PASSWORD: string;
  DATABASE_URL: string;
}

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    ADMIN_PASSWORD: string;
    DATABASE_URL: string;
  }
  var __CLOUDFLARE_CONTEXT__: { env: CloudflareEnv } | undefined;
}

export {};
