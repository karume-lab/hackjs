import { app } from "@repo/api";

export async function GET(request: Request) {
  // Pass the request to Elysia which handles serving the openapi.json
  // Make sure we correctly construct a request pointing to /openapi.json on the Elysia app
  // But Elysia's swagger plugin already binds to /openapi.json path.
  // Our Next.js route is exactly /api/openapi.json, so the path inside Next.js request is correct
  return app.handle(request);
}
