import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile"]

// Auth routes that should be accessible only when not logged in
const authRoutes = ["/login", "/register"]

// Public routes that are always accessible
const publicRoutes = ["/", "/offers", "/search"]

export function middleware(request: NextRequest) {
  // Get token from cookies or authorization header
  const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.split(" ")[1]

  // Get the current path
  const path = request.nextUrl.pathname

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Check if the route is an auth route (login/register)
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route))

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => path === route)

  // Case 1: User is logged in
  if (token) {
    // If trying to access auth routes, redirect to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    // Otherwise, allow access to all routes
    return NextResponse.next()
  }

  // Case 2: User is NOT logged in
  else {
    // If trying to access protected routes, redirect to login
    if (isProtectedRoute) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", path)
      return NextResponse.redirect(loginUrl)
    }

    // Allow access to auth routes and public routes
    if (isAuthRoute || isPublicRoute) {
      return NextResponse.next()
    }

    // For any other route, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
