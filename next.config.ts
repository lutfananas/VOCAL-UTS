import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Cloudflare Pages: don't use "standalone" - next-on-pages handles output
  // For local dev: keep working as before
  output: undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Required for @cloudflare/next-on-pages
  experimental: {
    // Enable if needed for edge runtime
  },
};

export default nextConfig;
