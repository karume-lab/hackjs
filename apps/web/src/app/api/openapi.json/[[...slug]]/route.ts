import { app } from "@repo/api";

export async function GET(request: Request) {
  return app.handle(request);
}
