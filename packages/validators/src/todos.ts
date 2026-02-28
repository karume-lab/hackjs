import * as schema from "@repo/db/schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const insertTodoSchema = createInsertSchema(schema.todos).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const updateTodoSchema = createUpdateSchema(schema.todos).omit({
  createdAt: true,
  userId: true,
});

export const adminCreateTodoSchema = insertTodoSchema.extend({
  userId: z.string().min(1, "You must select a user to assign this Todo to"),
});

export const selectTodoSchema = createSelectSchema(schema.todos);
