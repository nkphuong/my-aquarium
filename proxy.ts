import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * Edge Proxy for Route Protection
 *
 * Protects all routes EXCEPT explicitly defined public routes.
 * New pages in (authenticated) folder are automatically protected.
 *
 * Note: Migrated from middleware.ts per Next.js 16 convention.
 */

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/about', '/terms', '/privacy']

export const proxy = auth((req) => {
    const { nextUrl, auth: session } = req
    const pathname = nextUrl.pathname

    // In mock mode, skip all auth checks
    if (process.env.MOCK_MODE === 'true') {
        return NextResponse.next()
    }

    const isAuthenticated = !!session?.user
    // Check if current path is a public route
    const isPublicRoute = publicRoutes.includes(pathname)

    // Redirect to login if accessing protected route without auth
    if (!isPublicRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', nextUrl.origin)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect to dashboard if accessing login/register while authenticated
    const isAuthRoute = pathname === '/login' || pathname === '/register'
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', nextUrl.origin))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes (handled separately)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, images, etc.
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
    ],
}
