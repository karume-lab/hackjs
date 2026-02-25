import { auth } from "@repo/auth";
import { db, schema } from "@repo/db";
import { insertTodoSchema, updateTodoSchema } from "@repo/validators";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminOS } from "../os";

export const adminRouter = adminOS.router({
  // ---> Users <---
  getUsers: adminOS.handler(async () => {
    return await db.query.user.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
  }),
  getUser: adminOS.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const u = await db.query.user.findFirst({
      where: eq(schema.user.id, input.id),
    });
    if (!u) throw new Error("User not found");
    return u;
  }),
  updateUserRole: adminOS
    .input(z.object({ id: z.string(), role: z.enum(["admin", "user"]) }))
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
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["admin", "user"]).default("user"),
      }),
    )
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
  deleteUser: adminOS.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    // Must also clear their sessions/accounts to avoid orphans
    await db.delete(schema.session).where(eq(schema.session.userId, input.id));
    await db.delete(schema.account).where(eq(schema.account.userId, input.id));
    await db.delete(schema.todos).where(eq(schema.todos.userId, input.id));

    return await db.delete(schema.user).where(eq(schema.user.id, input.id)).returning();
  }),

  // ---> Todos <---
  getTodos: adminOS.handler(async () => {
    // Admins can see ALL todos in the system
    return await db.query.todos.findMany({
      orderBy: (todos, { desc }) => [desc(todos.createdAt)],
    });
  }),
  getTodo: adminOS.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const t = await db.query.todos.findFirst({
      where: eq(schema.todos.id, input.id),
    });
    if (!t) throw new Error("Todo not found");
    return t;
  }),
  createTodo: adminOS
    .input(insertTodoSchema.extend({ userId: z.string() }))
    .handler(async ({ input }) => {
      // Admins can create a todo for ANY user ID
      return await db.insert(schema.todos).values(input).returning();
    }),
  updateTodo: adminOS
    .input(updateTodoSchema.extend({ id: z.string() }))
    .handler(async ({ input }) => {
      return await db
        .update(schema.todos)
        .set(input)
        .where(eq(schema.todos.id, input.id))
        .returning();
    }),
  deleteTodo: adminOS.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    return await db.delete(schema.todos).where(eq(schema.todos.id, input.id)).returning();
  }),
});
