import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  url: "/api/openapi.json",
};

export const GET = ApiReference(config);
