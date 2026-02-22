import { os } from "@orpc/server";
import { db, schema } from "@repo/db";
import { insertItemSchema } from "@repo/validators";

export const addItem = os.input(insertItemSchema).handler(async ({ input }) => {
  return await db.insert(schema.items).values(input).returning();
});

export const router = os.router({
  addItem,
});
