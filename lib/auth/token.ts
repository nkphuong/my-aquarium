/**
 * Server Token Helper
 *
 * Extracts access token from NextAuth session cookie on server-side.
 * Used by: Authenticated HTTP client
 */

import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt'

export async function getServerAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies()

    const cookieName =
        process.env.NODE_ENV === 'production'
            ? '__Secure-authjs.session-token'
            : 'authjs.session-token'

    const tokenCookie =
        cookieStore.get(cookieName) ||
        cookieStore.get('__Secure-next-auth.session-token') ||
        cookieStore.get('next-auth.session-token')

    if (!tokenCookie) {
        return undefined
    }

    try {
        const decoded = await decode({
            token: tokenCookie.value,
            secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '',
            salt: tokenCookie.name,
        })

        return decoded?.accessToken as string | undefined
    } catch (error) {
        console.error('Failed to decode server session token', error)
        return undefined
    }
}
