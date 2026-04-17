import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthApi = pathname.startsWith("/api/auth");

  const decoded = token ? verifyToken(token) : null;

  // لو المستخدم مسجل دخول ويحاول فتح login او register
  if (isPublicRoute && decoded) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // لو يحاول دخول أي صفحة محمية بدون تسجيل دخول
  if (!isPublicRoute && !isAuthApi && !decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ]
};