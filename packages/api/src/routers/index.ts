import { pubOS } from "../os";
import { todosRouter } from "./todos";

export const router = pubOS.router({
  todos: todosRouter,
});
