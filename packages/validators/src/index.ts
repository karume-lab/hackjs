import { schema } from "@repo/db";
import { createInsertSchema } from "drizzle-zod";

export const insertItemSchema = createInsertSchema(schema.items).omit({
  id: true,
});
