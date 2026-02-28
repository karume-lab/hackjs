export * as schema from "@repo/db/schema";

import { createClient } from "@libsql/client/node";
import * as schema from "@repo/db/schema";
import { drizzle } from "drizzle-orm/libsql";

export function createDbClient() {
  const dbPath = new URL("../local.db", import.meta.url).pathname;
  const defaultDbUrl = `file:${dbPath}`;

  const client = createClient({
    url: process.env.DATABASE_URL ?? defaultDbUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
}

export const db = createDbClient();
