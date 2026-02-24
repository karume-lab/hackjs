import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCReactQueryUtils } from "@orpc/react-query";
import type { RouterClient } from "@orpc/server";
import { getBaseUrl } from "@repo/utils";
import type { router } from "./routers";

export const client = createORPCClient<RouterClient<typeof router>>(
  new RPCLink({ url: `${getBaseUrl()}/api/orpc` }),
);

export const orpc = createORPCReactQueryUtils(client);
export const orpcUtils = orpc;
