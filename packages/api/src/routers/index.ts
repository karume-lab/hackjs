import { pubOS } from "../os";
import { adminRouter } from "./admin";
import { todosRouter } from "./todos";

export const router = pubOS.router({
  admin: adminRouter,
  todos: todosRouter,
});
