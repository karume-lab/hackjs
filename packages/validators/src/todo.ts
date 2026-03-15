import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "Task title is required").max(100, "Task title is too long"),
});

export type TodoFormValues = z.infer<typeof todoSchema>;
