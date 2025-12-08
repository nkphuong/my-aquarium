import { auth } from '@/infrastructure/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLogin = req.nextUrl.pathname.startsWith('/login')

  // Protected routes (dashboard, diagnosis, etc.)
  const isOnProtectedRoute =
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/diagnosis')

  // Redirect to login if not authenticated and trying to access protected routes
  if (isOnProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect to dashboard if authenticated and on login page
  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  return undefined
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
