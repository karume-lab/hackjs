import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema/index";

let defaultDbUrl = "file:local.db";
try {
  const dbPath = path.resolve(__dirname, "../../..", "local.db");
  defaultDbUrl = `file:${dbPath}`;
} catch (e) {
  defaultDbUrl = "file:../../local.db";
}

const client = createClient({
  url: process.env.DATABASE_URL ?? defaultDbUrl,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
