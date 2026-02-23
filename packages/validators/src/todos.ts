import * as schema from "@repo/db/schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const insertTodoSchema = createInsertSchema(schema.todos).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const updateTodoSchema = createUpdateSchema(schema.todos).omit({
  createdAt: true,
  userId: true,
});
