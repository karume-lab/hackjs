import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { router } from "@repo/api/routers";
import { Elysia } from "elysia";

const routes = new Elysia()
  .use(cors())
  .use(
    swagger({
      provider: "swagger-ui",
      documentation: {
        info: {
          title: "HackJS API",
          version: "1.0.0",
        },
      },
      path: "/openapi.json",
    }),
  )
  .use(router);

export const app = new Elysia().group("/api", (app) => app.use(routes));

export type App = typeof app;
