import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"

// Public routes
const PUBLIC_ROUTES = ["/"]

// Public authentication APIs
const PUBLIC_APIS = ["api/auth"]

// Authentication and role-based route protection
export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Allow public and static resources
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith(".")
    ) {
        return NextResponse.next()
    }

    // Allow public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next()
    }

    // Allow public authentication APIs
    if (PUBLIC_APIS.includes(pathname)) {
        return NextResponse.next()
    }

    // Check user authentication
    const session = await auth()

    // Redirect unauthenticated users
    if (!session) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    // Get user role
    const role = session.user?.role

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
        if (role != "admin") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    // Protect partner routes
    if (pathname.startsWith("/partner")) {
        if (role != "partner") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    // Protect API routes
    if (pathname.startsWith("/api")) {
        if (!session.user) {
            return Response.json(
                { message: "unauthorize" },
                { status: 401 }
            )
        }
    }

    return NextResponse.next()
}

// Proxy route configuration
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}