import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookieName = process.env.AUTH_SESSION_COOKIE ?? "metaplatform_session";
  if (request.cookies.has(sessionCookieName)) return NextResponse.next();

  const signInUrl = new URL("/login", request.url);
  signInUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/apps/:path*"],
};
