import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/auth/signin") ||
      req.nextUrl.pathname.startsWith("/auth/signup")
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin")
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard")

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Check admin access
    if (isAdminPage && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Allow access to dashboard for authenticated users
    if (isDashboardPage && !isAuth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage =
          req.nextUrl.pathname.startsWith("/auth/signin") ||
          req.nextUrl.pathname.startsWith("/auth/signup")
        const isPublicPage =
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname.startsWith("/pricing") ||
          req.nextUrl.pathname.startsWith("/purchase") ||
          req.nextUrl.pathname.startsWith("/contact") ||
          req.nextUrl.pathname.startsWith("/about") ||
          req.nextUrl.pathname.startsWith("/staff")

        // Allow access to public pages
        if (isPublicPage) return true

        // Allow access to auth pages
        if (isAuthPage) return true

        // Require authentication for all other pages
        return !!token
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
}
