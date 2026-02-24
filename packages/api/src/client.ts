import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import type { RouterClient } from "@orpc/server";
import type { router } from "./routers";

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.EXPO_PUBLIC_APP_URL) return process.env.EXPO_PUBLIC_APP_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return "http://localhost:3000";
}

export const client = createORPCClient<RouterClient<typeof router>>(
  new RPCLink({ url: `${getBaseUrl()}/api/orpc` }),
);

export const orpc = createORPCReactQueryUtils(client);
export const orpcUtils = orpc;
