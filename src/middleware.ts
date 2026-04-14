import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const authRoutes = ["/login", "/register"];

  const isAuthPage = authRoutes.includes(pathname);
  const isDashboard = pathname === "/" || pathname.startsWith("/admin") || pathname.startsWith("/products");

  const decoded = token ? verifyToken(token) : null;

  // لو المستخدم مسجل دخول ويحاول فتح login او register
  if (isAuthPage && decoded) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // لو يحاول دخول dashboard بدون تسجيل
  if (isDashboard && !decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/products/:path*",
    "/login",
    "/register"
  ]
};