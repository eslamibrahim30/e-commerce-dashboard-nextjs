import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/admin"];

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*"
  ]
};