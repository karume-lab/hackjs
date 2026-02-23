import * as schema from "@repo/db/schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
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

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = createInsertSchema(schema.user)
  .pick({
    name: true,
    email: true,
  })
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
