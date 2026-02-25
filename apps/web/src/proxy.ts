import { auth } from "@repo/auth";
import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isRoot = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (!session && isDashboard) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${callbackUrl}`, request.url));
  }

  if (session && (isAuthPage || isRoot || isDashboard)) {
    if (session.user.role === "admin" && !isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (!isDashboard) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
