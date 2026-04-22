import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

export default NextAuth(authConfig).auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/signup") ||
    nextUrl.pathname.startsWith("/reset") ||
    nextUrl.pathname.startsWith("/verify");

  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname.startsWith("/api/health") ||
    nextUrl.pathname.startsWith("/templates");

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isStudioRoute = nextUrl.pathname.startsWith("/studio");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isApiAuthRoute) return NextResponse.next();

  // Redirect authenticated users away from auth pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (role === "ADMIN") return Response.redirect(new URL("/admin", nextUrl));
      if (role === "MENTOR") return Response.redirect(new URL("/studio", nextUrl));
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute) return NextResponse.next();

  // Protect all other routes
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // RBAC checks for specialized routes
  if (isStudioRoute && role !== "MENTOR" && role !== "ADMIN") {
    // Learners trying to access studio
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  if (isAdminRoute && role !== "ADMIN") {
    // Non-admins trying to access admin
    if (role === "MENTOR") return Response.redirect(new URL("/studio", nextUrl));
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
