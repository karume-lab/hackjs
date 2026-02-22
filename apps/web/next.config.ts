import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/api", "@repo/auth", "@repo/db", "@repo/ui", "@repo/validators"],
};

export default nextConfig;
