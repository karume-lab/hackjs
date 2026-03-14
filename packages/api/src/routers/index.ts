import { adminRouter } from "@repo/api/routers/admin";
import { todoRouter } from "@repo/api/routers/todo";
import { Elysia } from "elysia";

export const router = new Elysia().use(adminRouter).use(todoRouter);
