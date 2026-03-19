import { AUTH_SESSION_COOKIE, isDemoSession } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  const isAuthenticated = isDemoSession(session);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
