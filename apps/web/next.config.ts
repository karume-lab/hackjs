import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.NEXT_PUBLIC_ALLOWED_DEV_ORIGINS?.split(",") ?? [],
  typedRoutes: true,
  transpilePackages: [
    "@repo/api",
    "@repo/auth",
    "@repo/db",
    "@repo/ui",
    "@repo/validators",
    "@repo/types",
    "@repo/utils",
  ],
};

export default nextConfig;
