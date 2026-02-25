import { os as orpcOS } from "@orpc/server";
import { auth } from "@repo/auth";

export const pubOS = orpcOS.$context<{ headers: Headers }>();

export const protectedOS = pubOS.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return next({
    context: {
      ...context,
      user: session.user,
      session: session.session,
    },
  });
});

export const adminOS = protectedOS.use(async ({ context, next }) => {
  if (context.user.role !== "admin") {
    throw new Error("FORBIDDEN: Admin access required");
  }
  return next({
    context,
  });
});
