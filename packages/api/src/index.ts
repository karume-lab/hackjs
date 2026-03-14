import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { router } from "@repo/api/routers";
import { auth } from "@repo/auth";
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
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    return { session, user: session?.user ?? null };
  })
  .use(router);

export const app = new Elysia().group("/api", (app) => app.use(routes));

export type App = typeof app;
export * from "@repo/api/query";
