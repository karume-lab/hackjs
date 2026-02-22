import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@repo/api";

const rpcHandler = new RPCHandler(router);

export async function GET(request: Request) {
  const { response } = await rpcHandler.handle(request, { prefix: "/api/orpc" });
  return response ?? new Response("Not found", { status: 404 });
}

export async function POST(request: Request) {
  const { response } = await rpcHandler.handle(request, { prefix: "/api/orpc" });
  return response ?? new Response("Not found", { status: 404 });
}
