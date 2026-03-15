import {
  PaginatedTodoWithUserResponseSchema,
  PaginatedUserResponseSchema,
  UserSchema,
} from "@repo/api/routers/types";
import { auth } from "@repo/auth";
import { db, schema } from "@repo/db";
import type { TodoWithUser, User } from "@repo/db/types";
import { TODO_STATUSES } from "@repo/types";
import { and, eq, like, or, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";

export const adminRouter = new Elysia({ prefix: "/admin" })
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      throw new Response("Unauthorized", { status: 401 });
    }
    if (session.user.role !== "admin") {
      throw new Response("Forbidden: Admin access required", { status: 403 });
    }
    return { user: session.user };
  })
  .get(
    "/users",
    async ({ query }) => {
      const limit = query.limit || 10;
      const page = query.page || 1;
      const offset = (page - 1) * limit;

      const where = query.search
        ? or(
            like(schema.user.name, `%${query.search}%`),
            like(schema.user.email, `%${query.search}%`),
          )
        : undefined;

      const data = await db.query.user.findMany({
        where,
        orderBy: (users, { desc }) => [desc(users.createdAt)],
        limit,
        offset,
      });

      const countResult = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(schema.user)
        .where(where);
      const totalCount = countResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: data as User[],
        metadata: { totalCount, page, totalPages },
      };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 10 })),
        page: t.Optional(t.Numeric({ default: 1 })),
        search: t.Optional(t.String()),
      }),
      detail: { tags: ["Admin"], description: "Get paginated list of all users" },
      response: PaginatedUserResponseSchema,
    },
  )
  .post(
    "/users",
    async ({ body }) => {
      const { email, password, name, role } = body;

      const result = await auth.api.signUpEmail({
        body: { email, password, name },
        asResponse: false,
      });

      const [user] = await db
        .update(schema.user)
        .set({ role: role ?? "user" })
        .where(eq(schema.user.id, result.user.id))
        .returning();

      if (!user) throw new Response("Failed to retrieve created user", { status: 500 });

      return user as User;
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
        role: t.Optional(t.Union([t.Literal("admin"), t.Literal("user")])),
      }),
      detail: { tags: ["Admin"], description: "Create a new user with a specific role" },
      response: UserSchema,
    },
  )
  .get(
    "/users/:id",
    async ({ params: { id } }) => {
      const user = await db.query.user.findFirst({
        where: eq(schema.user.id, id),
      });
      if (!user) throw new Response("User not found", { status: 404 });
      return user as User;
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Admin"], description: "Get a single user by ID" },
      response: UserSchema,
    },
  )
  .put(
    "/users/:id/role",
    async ({ params: { id }, body: { role } }) => {
      const [updated] = await db
        .update(schema.user)
        .set({ role })
        .where(eq(schema.user.id, id))
        .returning();
      if (!updated) throw new Response("User not found", { status: 404 });
      return updated as User;
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({ role: t.Union([t.Literal("admin"), t.Literal("user")]) }),
      detail: { tags: ["Admin"], description: "Update a user's role" },
      response: UserSchema,
    },
  )
  .delete(
    "/users/:id",
    async ({ params: { id } }) => {
      const existing = await db.query.user.findFirst({
        where: eq(schema.user.id, id),
      });
      if (!existing) throw new Response("User not found", { status: 404 });

      await auth.api.removeUser({ body: { userId: id } });
      return { success: true };
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Admin"], description: "Delete a user" },
      response: t.Object({ success: t.Boolean() }),
    },
  )
  .get(
    "/stats",
    async () => {
      const [userStats] = await db
        .select({
          total: sql<number>`cast(count(*) as int)`,
          banned: sql<number>`cast(sum(case when banned=1 then 1 else 0 end) as int)`,
        })
        .from(schema.user);

      const [todoStats] = await db
        .select({
          total: sql<number>`cast(count(*) as int)`,
          completed: sql<number>`cast(sum(case when completed=1 then 1 else 0 end) as int)`,
        })
        .from(schema.todo);

      if (!userStats || !todoStats) {
        throw new Response("Failed to fetch stats", { status: 500 });
      }

      return {
        users: { total: userStats.total, banned: userStats.banned },
        todos: { total: todoStats.total, completed: todoStats.completed },
      };
    },
    {
      detail: { tags: ["Admin"], description: "Get administrative statistics" },
      response: t.Object({
        users: t.Object({ total: t.Number(), banned: t.Number() }),
        todos: t.Object({ total: t.Number(), completed: t.Number() }),
      }),
    },
  )
  .get(
    "/todos",
    async ({ query }) => {
      const limit = query.limit || 50;
      const page = query.page || 1;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (query.search) {
        conditions.push(like(schema.todo.title, `%${query.search}%`));
      }
      if (query.status !== undefined) {
        conditions.push(eq(schema.todo.completed, query.status === "completed"));
      }
      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const data = await db.query.todo.findMany({
        with: { user: true },
        where,
        orderBy: (todos, { desc }) => [desc(todos.createdAt)],
        limit,
        offset,
      });

      const countResult = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(schema.todo)
        .where(where);
      const totalCount = countResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: data as TodoWithUser[],
        metadata: { totalCount, page, totalPages },
      };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 50 })),
        page: t.Optional(t.Numeric({ default: 1 })),
        search: t.Optional(t.String()),
        status: t.Optional(t.Union(TODO_STATUSES.map((s) => t.Literal(s)))),
      }),
      detail: { tags: ["Admin"], description: "Get all todos from all users" },
      response: PaginatedTodoWithUserResponseSchema,
    },
  );
