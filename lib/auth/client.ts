/**
 * Authenticated HTTP Client
 *
 * Creates an HTTP client with auth token from NextAuth session.
 * Used by: Accessors for authenticated API calls
 */

import { getServerAccessToken } from './token'
import { createHttpClient } from '../api/client'

export async function getAuthenticatedClient() {
    const accessToken = await getServerAccessToken()

    const client = createHttpClient(
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    )

    if (accessToken) {
        return client.withAuth(accessToken)
    }

    return client
}
