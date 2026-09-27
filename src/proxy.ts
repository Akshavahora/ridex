import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"

// Public routes
const PUBLIC_ROUTES = ["/"]

// Public authentication APIs
const PUBLIC_APIS = ["/api/auth"]

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Allow Next.js static files and favicon
    if (
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        pathname.includes(".")
    ) {
        return NextResponse.next()
    }

    // Allow public pages
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next()
    }

    // Allow public authentication APIs
    if (
        PUBLIC_APIS.some((api) => pathname.startsWith(api))
    ) {
        return NextResponse.next()
    }

    // Check authentication
    const session = await auth()

    // If user is not logged in, redirect to home page
    if (!session) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    // Admin route protection
    if (
        pathname.startsWith("/admin") &&
        session.user?.role !== "admin"
    ) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    // Partner route protection
    if (
        pathname.startsWith("/partner") &&
        session.user?.role !== "partner"
    ) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    // Allow authenticated user
    return NextResponse.next()
}