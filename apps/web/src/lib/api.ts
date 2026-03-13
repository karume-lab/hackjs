import { createClient } from "@repo/api/client";

export const api = createClient(
  typeof window === "undefined" ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "/api",
);
