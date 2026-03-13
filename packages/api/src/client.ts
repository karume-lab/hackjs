import { treaty } from "@elysiajs/eden";
import type { App } from "@repo/api";

export type { App };
export const createClient = (baseUrl: string) => treaty<App>(baseUrl);
