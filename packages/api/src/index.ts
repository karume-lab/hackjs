import swagger from "@elysiajs/swagger";
import { router } from "@repo/api/routers";
import { auth } from "@repo/auth";
import { Elysia } from "elysia";

export const app = new Elysia()
  .use(
    swagger({
      provider: "swagger-ui",
      documentation: {
        info: {
          title: "HackJS API",
          version: "1.0.0",
        },
      },
      path: "/openapi.json", // Expose standard json here if needed
    }),
  )
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    return { session, user: session?.user ?? null };
  })
  .use(router);

export type App = typeof app;
export * from "@repo/api/query";
