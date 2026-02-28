import { protectedOS } from "@repo/api/os";
import { db, schema } from "@repo/db";
import { insertTodoSchema, selectTodoSchema, updateTodoSchema } from "@repo/validators";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const todosRouter = protectedOS.router({
  getTodos: protectedOS
    .output(z.array(selectTodoSchema))
    .route({ description: "Get all todos for the current user", tags: ["Todos"] })
    .handler(async ({ context }) => {
      return await db.query.todos.findMany({
        where: eq(schema.todos.userId, context.user.id),
        orderBy: (todos, { desc }) => [desc(todos.createdAt)],
      });
    }),
  createTodo: protectedOS
    .input(insertTodoSchema)
    .output(z.array(selectTodoSchema))
    .route({ description: "Create a new todo", tags: ["Todos"] })
    .handler(async ({ input, context }) => {
      return await db
        .insert(schema.todos)
        .values({
          ...input,
          userId: context.user.id,
        })
        .returning();
    }),
  updateTodo: protectedOS
    .input(updateTodoSchema)
    .output(z.array(selectTodoSchema))
    .route({ description: "Update an existing todo", tags: ["Todos"] })
    .handler(async ({ input, context }) => {
      if (!input.id) throw new Error("ID is required");

      return await db
        .update(schema.todos)
        .set(input)
        .where(and(eq(schema.todos.id, String(input.id)), eq(schema.todos.userId, context.user.id)))
        .returning();
    }),
  deleteTodo: protectedOS
    .input(z.object({ id: z.string() }))
    .output(z.array(selectTodoSchema))
    .route({ description: "Delete a todo", tags: ["Todos"] })
    .handler(async ({ input, context }) => {
      return await db
        .delete(schema.todos)
        .where(and(eq(schema.todos.id, input.id), eq(schema.todos.userId, context.user.id)))
        .returning();
    }),
});
