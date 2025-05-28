import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile"]

// Auth routes that should not be accessible when logged in
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  // Get token from cookies or authorization header
  const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.split(" ")[1]

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Check if the route is an auth route (login/register)
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If it's a protected route and no token is found, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If it's an auth route (login/register) and user is already logged in, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
}
