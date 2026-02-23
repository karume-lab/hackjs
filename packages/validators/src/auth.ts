import * as schema from "@repo/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
