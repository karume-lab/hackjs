import { OpenAPIGenerator } from "@orpc/openapi";
import { router } from "@repo/api";

/**
 * Custom OpenAPI converter for Zod v4 schemas.
 * Zod v4 uses a different internal structure than v3 and includes a built-in toJSONSchema method.
 */
class ZodV4ToJsonSchemaConverter {
  condition(schema: any): boolean {
    // Zod v4 schemas have a ~standard property with vendor "zod" and an internal _zod property.
    return schema?.["~standard"]?.vendor === "zod" && !!schema._zod;
  }

  async convert(schema: any, options: any): Promise<[boolean, any]> {
    // Use Zod v4's built-in toJSONSchema method.
    // We set unrepresentable to "any" to avoid throwing on Dates/Symbols,
    // and use an override to provide a proper OpenAPI representation for Dates.
    const json = await schema.toJSONSchema({
      target: options.target === "openapi-3.0" ? "openapi-3.0" : "draft-2020-12",
      io: options.strategy,
      unrepresentable: "any",
      override: ({ zodSchema, jsonSchema }: any) => {
        // Map Date objects to string with date-time format
        if (zodSchema._zod?.def?.type === "date") {
          jsonSchema.type = "string";
          jsonSchema.format = "date-time";
        }
      },
    });

    // Remove $schema to prevent it from appearing in every component schema in the OpenAPI spec.
    if (json && typeof json === "object") {
      delete (json as any).$schema;
    }

    // Determine if the schema is required.
    const isRequired = typeof schema.isOptional === "function" ? !schema.isOptional() : true;

    return [isRequired, json];
  }
}

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [new ZodV4ToJsonSchemaConverter()],
});

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
