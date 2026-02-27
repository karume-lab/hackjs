import { pubOS } from "@repo/api/os";
import { adminRouter } from "@repo/api/routers/admin";
import { todosRouter } from "@repo/api/routers/todos";

export const router = pubOS.router({
  admin: adminRouter,
  todos: todosRouter,
});
