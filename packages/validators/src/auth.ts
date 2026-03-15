import { user } from "@repo/db/schema/auth";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectUserSchema = createSelectSchema(user);

export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]),
});

export const updateUserSchema = z.object({
  role: z.enum(["admin", "user"]),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type CreateUserValues = z.infer<typeof createUserSchema>;
export type UpdateUserValues = z.infer<typeof updateUserSchema>;
export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
