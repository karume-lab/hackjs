import { OpenAPIGenerator } from "@orpc/openapi";
import { router } from "@repo/api";

const openAPIGenerator = new OpenAPIGenerator();

export async function GET() {
  const spec = await openAPIGenerator.generate(router, {
    info: {
      title: "HackJS API",
      version: "1.0.0",
      description: "API documentation for the HackJS project",
    },
  });

  return Response.json(spec);
}
