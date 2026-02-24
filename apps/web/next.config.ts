import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",") ?? [],
  transpilePackages: ["@repo/api", "@repo/auth", "@repo/db", "@repo/ui", "@repo/validators"],
};

export default nextConfig;
