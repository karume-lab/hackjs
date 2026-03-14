import { app } from "@repo/api";

export const GET = async (request: Request) => {
  return app.handle(request);
};
