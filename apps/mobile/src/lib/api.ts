import { createClient } from "@repo/api/client";
import { getBaseUrl } from "@repo/utils";

export const api = createClient(`${getBaseUrl()}/api`);
