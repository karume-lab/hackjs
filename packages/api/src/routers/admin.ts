import { auth } from "@repo/auth";
import { db, schema } from "@repo/db";
import { eq, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";

export const adminRouter = new Elysia({ prefix: "/admin" })
  .derive(async ({ request }) => {
    // Rederive just to be safe, or assume inheriting from global
    // But since BetterAuth session might be shared, let's rely on global context
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) throw new Error("UNAUTHORIZED");
    if (session.user.role !== "admin") throw new Error("FORBIDDEN: Admin access required");
    return { user: session.user };
  })
  .get(
    "/users",
    async ({ query }) => {
      const limit = query.limit || 10;
      const page = query.page || 1;
      const offset = (page - 1) * limit;

      const data = await db.query.user.findMany({
        orderBy: (users, { desc }) => [desc(users.createdAt)],
        limit,
        offset,
      });

      const countResult = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(schema.user);
      const totalCount = countResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        data,
        metadata: {
          totalCount,
          page,
          totalPages,
        },
      };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric({ default: 10 })),
        page: t.Optional(t.Numeric({ default: 1 })),
      }),
      detail: { tags: ["Admin"], description: "Get paginated list of all users" },
    },
  )
  .post(
    "/users",
    async ({ body }) => {
      const result = await auth.api.signUpEmail({
        body: {
          email: body.email,
          password: body.password,
          name: body.name,
        },
        asResponse: false,
      });

      const createdUser = result.user;

      if (body.role === "admin") {
        await db
          .update(schema.user)
          .set({ role: "admin" })
          .where(eq(schema.user.id, createdUser.id));
      }

      return createdUser;
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
        role: t.Optional(t.Union([t.Literal("admin"), t.Literal("user")])),
      }),
      detail: { tags: ["Admin"], description: "Create a new user with a specific role" },
    },
  )
  .get(
    "/users/:id",
    async ({ params: { id } }) => {
      const u = await db.query.user.findFirst({
        where: eq(schema.user.id, id),
      });
      if (!u) throw new Error("User not found");
      return u;
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Admin"], description: "Get a single user by ID" },
    },
  )
  .put(
    "/users/:id/role",
    async ({ params: { id }, body: { role } }) => {
      return await db.update(schema.user).set({ role }).where(eq(schema.user.id, id)).returning();
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({ role: t.Union([t.Literal("admin"), t.Literal("user")]) }),
      detail: { tags: ["Admin"], description: "Update a user's role" },
    },
  )
  .delete(
    "/users/:id",
    async ({ params: { id } }) => {
      await db.delete(schema.session).where(eq(schema.session.userId, id));
      await db.delete(schema.account).where(eq(schema.account.userId, id));
      return await db.delete(schema.user).where(eq(schema.user.id, id)).returning();
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Admin"], description: "Delete a user" },
    },
  );
