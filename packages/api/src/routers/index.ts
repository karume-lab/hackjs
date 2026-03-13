import { adminRouter } from "@repo/api/routers/admin";
import { Elysia } from "elysia";

export const router = new Elysia().use(adminRouter);
