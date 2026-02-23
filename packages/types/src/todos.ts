import type { InferRouterOutputs } from "@orpc/server";
import type { AppRouter } from "@repo/api";

type RouterOutput = InferRouterOutputs<AppRouter>;

export type Todo = RouterOutput["todos"]["getTodos"][number];
