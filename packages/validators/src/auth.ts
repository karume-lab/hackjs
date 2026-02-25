import * as schema from "@repo/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = createInsertSchema(schema.user)
  .pick({
    name: true,
    email: true,
  })
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]),
});

export const updateUserSchema = z.object({
  role: z.enum(["admin", "user"]),
});
