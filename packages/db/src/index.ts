export * as schema from "./schema";

import { createClient } from "@libsql/client/node";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

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
