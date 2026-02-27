export * as schema from "@repo/db/schema";

import { createClient } from "@libsql/client/node";
import * as schema from "@repo/db/schema";
import { drizzle } from "drizzle-orm/libsql";

export function createDbClient() {
  let defaultDbUrl = "file:local.db";
  const path = require("node:path");
  const dbPath = path.resolve(__dirname, "../../..", "local.db");
  defaultDbUrl = `file:${dbPath}`;

  const client = createClient({
    url: process.env.DATABASE_URL ?? defaultDbUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
}

export const db = createDbClient();
