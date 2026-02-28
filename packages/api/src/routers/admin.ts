import { adminOS } from "@repo/api/os";
import { auth } from "@repo/auth";
import { db, schema } from "@repo/db";
import {
  insertTodoSchema,
  selectTodoSchema,
  selectUserSchema,
  updateTodoSchema,
} from "@repo/validators";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export const adminRouter = adminOS.router({
  // ---> Users <---
  getUsers: adminOS
    .input(
      z
        .object({
          limit: z.number().min(1).max(1000).default(10),
          page: z.number().min(1).default(1),
        })
        .optional()
        .default({ limit: 10, page: 1 }),
    )
    .output(
      z.object({
        data: z.array(selectUserSchema),
        metadata: z.object({
          totalCount: z.number(),
          page: z.number(),
          totalPages: z.number(),
        }),
      }),
    )
    .route({ description: "Get a paginated list of all users", tags: ["Admin"] })
    .handler(async ({ input }) => {
      const { limit, page } = input;
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
    }),
  getUser: adminOS
    .input(z.object({ id: z.string() }))
    .output(selectUserSchema.nullable())
    .route({ description: "Get a single user by ID", tags: ["Admin"] })
    .handler(async ({ input }) => {
      const u = await db.query.user.findFirst({
        where: eq(schema.user.id, input.id),
      });
      if (!u) throw new Error("User not found");
      return u;
    }),
  updateUserRole: adminOS
    .input(z.object({ id: z.string(), role: z.enum(["admin", "user"]) }))
    .output(z.array(selectUserSchema))
    .route({ description: "Update a user's role", tags: ["Admin"] })
    .handler(async ({ input }) => {
      return await db
        .update(schema.user)
        .set({ role: input.role })
        .where(eq(schema.user.id, input.id))
        .returning();
    }),
  createUser: adminOS
    .input(
      z.object({
        name: z.string().min(2),
        email: z.email(),
        password: z.string().min(6),
        role: z.enum(["admin", "user"]).default("user"),
      }),
    )
    .output(selectUserSchema)
    .route({ description: "Create a new user with a specific role", tags: ["Admin"] })
    .handler(async ({ input }) => {
      // Use BetterAuth to properly hash the new password and run internal user creation routines
      const result = await auth.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
        },
        asResponse: false,
      });

      const createdUser = result.user;

      // Update their role appropriately (BetterAuth defaults to nothing/user)
      if (input.role === "admin") {
        await db
          .update(schema.user)
          .set({ role: "admin" })
          .where(eq(schema.user.id, createdUser.id));
      }

      return createdUser;
    }),
  deleteUser: adminOS
    .input(z.object({ id: z.string() }))
    .output(z.array(selectUserSchema))
    .route({ description: "Delete a user and all their associated data", tags: ["Admin"] })
    .handler(async ({ input }) => {
      // Must also clear their sessions/accounts to avoid orphans
      await db.delete(schema.session).where(eq(schema.session.userId, input.id));
      await db.delete(schema.account).where(eq(schema.account.userId, input.id));
      await db.delete(schema.todos).where(eq(schema.todos.userId, input.id));

      return await db.delete(schema.user).where(eq(schema.user.id, input.id)).returning();
    }),

  // ---> Todos <---
  getTodos: adminOS
    .input(
      z
        .object({
          limit: z.number().min(1).max(1000).default(10),
          page: z.number().min(1).default(1),
        })
        .optional()
        .default({ limit: 10, page: 1 }),
    )
    .output(
      z.object({
        data: z.array(selectTodoSchema),
        metadata: z.object({
          totalCount: z.number(),
          page: z.number(),
          totalPages: z.number(),
        }),
      }),
    )
    .route({ description: "Get a paginated list of all todos in the system", tags: ["Admin"] })
    .handler(async ({ input }) => {
      const { limit, page } = input;
      const offset = (page - 1) * limit;

      const data = await db.query.todos.findMany({
        orderBy: (todos, { desc }) => [desc(todos.createdAt)],
        limit,
        offset,
      });

      const countResult = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(schema.todos);
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
    }),
  getTodo: adminOS
    .input(z.object({ id: z.string() }))
    .output(selectTodoSchema.nullable())
    .route({ description: "Get any todo by ID", tags: ["Admin"] })
    .handler(async ({ input }) => {
      const t = await db.query.todos.findFirst({
        where: eq(schema.todos.id, input.id),
      });
      if (!t) throw new Error("Todo not found");
      return t;
    }),
  createTodo: adminOS
    .input(insertTodoSchema.extend({ userId: z.string() }))
    .output(z.array(selectTodoSchema))
    .route({ description: "Create a todo for any user", tags: ["Admin"] })
    .handler(async ({ input }) => {
      // Admins can create a todo for ANY user ID
      return await db.insert(schema.todos).values(input).returning();
    }),
  updateTodo: adminOS
    .input(updateTodoSchema.extend({ id: z.string() }))
    .output(z.array(selectTodoSchema))
    .route({ description: "Update any todo", tags: ["Admin"] })
    .handler(async ({ input }) => {
      return await db
        .update(schema.todos)
        .set(input)
        .where(eq(schema.todos.id, input.id))
        .returning();
    }),
  deleteTodo: adminOS
    .input(z.object({ id: z.string() }))
    .output(z.array(selectTodoSchema))
    .route({ description: "Delete any todo", tags: ["Admin"] })
    .handler(async ({ input }) => {
      return await db.delete(schema.todos).where(eq(schema.todos.id, input.id)).returning();
    }),
});
