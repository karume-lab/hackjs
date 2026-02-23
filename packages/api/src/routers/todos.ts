import { db, schema } from "@repo/db";
import { insertTodoSchema, updateTodoSchema } from "@repo/validators";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedOS } from "../os";

export const todosRouter = protectedOS.router({
  getTodos: protectedOS.handler(async ({ context }) => {
    return await db.query.todos.findMany({
      where: eq(schema.todos.userId, context.user.id),
      orderBy: (todos, { desc }) => [desc(todos.createdAt)],
    });
  }),
  createTodo: protectedOS.input(insertTodoSchema).handler(async ({ input, context }) => {
    return await db
      .insert(schema.todos)
      .values({
        ...input,
        userId: context.user.id,
      })
      .returning();
  }),
  updateTodo: protectedOS.input(updateTodoSchema).handler(async ({ input, context }) => {
    if (!input.id) throw new Error("ID is required");

    return await db
      .update(schema.todos)
      .set(input)
      .where(and(eq(schema.todos.id, String(input.id)), eq(schema.todos.userId, context.user.id)))
      .returning();
  }),
  deleteTodo: protectedOS
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      return await db
        .delete(schema.todos)
        .where(and(eq(schema.todos.id, input.id), eq(schema.todos.userId, context.user.id)))
        .returning();
    }),
});
