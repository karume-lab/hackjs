import { db, schema } from "@repo/db";
import { getLocalIPs } from "@repo/utils/get-ip";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    process.env.EXPO_PUBLIC_APP_URL ?? "",
    "exp://",
    ...getLocalIPs().flatMap((ip) => [`http://${ip}:3000`, `http://${ip}:8081`]),
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  plugins: [admin()],
});

export type Auth = typeof auth;
