import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value; // Ambil token dari cookies

  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin/dashboard");
  const isLoginRoute = pathname.startsWith("/admin/login");

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

// Middleware hanya untuk route admin/dashboard dan login
export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/login"],
};
