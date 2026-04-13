import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/admin"];
  const authRoutes = ["/login", "/register"];

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthPage = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isAuthPage && token) {

    const decoded = verifyToken(token);

    if (decoded) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }


  if (isProtected) {

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register"
  ]
};