import type { session, user } from "@repo/db/schema/auth";
import type { todo } from "@repo/db/schema/todos";

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Todo = typeof todo.$inferSelect;
export type NewTodo = typeof todo.$inferInsert;

export type TodoWithUser = Todo & { user: User };
