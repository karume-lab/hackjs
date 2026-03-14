import { auth } from "@repo/auth";
import { db, schema } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { TodoSchema } from "./types";

export const todoRouter = new Elysia({ prefix: "/todos" })
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) throw new Error("UNAUTHORIZED");
    return { user: session.user };
  })
  .get(
    "/",
    async ({ user }) => {
      return await db.query.todo.findMany({
        where: eq(schema.todo.userId, user.id),
        orderBy: (todo, { desc }) => [desc(todo.createdAt)],
      });
    },
    {
      detail: { tags: ["Todos"], description: "Get all todos for the current user" },
      response: t.Array(TodoSchema),
    },
  )
  .post(
    "/",
    async ({ user, body }) => {
      const [created] = await db
        .insert(schema.todo)
        .values({
          title: body.title,
          userId: user.id,
        })
        .returning();
      if (!created) throw new Error("Failed to create todo");
      return created;
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
      }),
      detail: { tags: ["Todos"], description: "Create a new todo" },
      response: TodoSchema,
    },
  )
  .patch(
    "/:id",
    async ({ user, params: { id }, body }) => {
      const [updated] = await db
        .update(schema.todo)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(and(eq(schema.todo.id, id), eq(schema.todo.userId, user.id)))
        .returning();
      if (!updated) throw new Error("Todo not found or unauthorized");
      return updated;
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String()),
        completed: t.Optional(t.Boolean()),
      }),
      detail: { tags: ["Todos"], description: "Update a todo" },
      response: TodoSchema,
    },
  )
  .delete(
    "/:id",
    async ({ user, params: { id } }) => {
      await db
        .delete(schema.todo)
        .where(and(eq(schema.todo.id, id), eq(schema.todo.userId, user.id)));
      return { success: true };
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Todos"], description: "Delete a todo" },
      response: t.Object({ success: t.Boolean() }),
    },
  );
