import { NextResponse } from "next/server";
import { auth } from "@/auth";

function dashboardForRole(role: string | null | undefined): string {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  if (role === "COMPANY") {
    return "/company/dashboard";
  }

  return "/";
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(request.auth?.user);
  const userRole = request.auth?.user?.role;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isCompanyRoute = pathname === "/company" || pathname.startsWith("/company/");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL(dashboardForRole(userRole), request.url));
  }

  if (isAdminRoute && (!isAuthenticated || userRole !== "ADMIN")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isCompanyRoute && (!isAuthenticated || userRole !== "COMPANY")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/company/:path*", "/login", "/register"],
};
