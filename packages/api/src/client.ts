import { createORPCClient } from "@orpc/client";
import type { router } from "./routers";

export const client = createORPCClient<typeof router>();
