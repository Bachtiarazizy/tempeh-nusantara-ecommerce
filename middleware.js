import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/login", "/register"];
  if (publicRoutes.includes(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/buyer")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = session.user.role;

    if (pathname.startsWith("/dashboard") && role === "BUYER") {
      return NextResponse.redirect(new URL("/buyer", request.url));
    }

    if (pathname.startsWith("/buyer") && role !== "BUYER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard/affiliate") && role !== "AFFILIATE") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const adminRoutes = ["/dashboard/orders", "/dashboard/affiliates", "/dashboard/settings"];
    if (adminRoutes.some((route) => pathname.startsWith(route)) && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
