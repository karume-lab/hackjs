export * as schema from "@repo/db/schema";

import { createClient } from "@libsql/client/node";
import * as schema from "@repo/db/schema";
import { drizzle } from "drizzle-orm/libsql";

export function createDbClient() {
  const url = process.env.DATABASE_URL || "file:../../../local.db";

  const client = createClient({
    url,
  });

  return drizzle(client, { schema });
}

export const db = createDbClient();
