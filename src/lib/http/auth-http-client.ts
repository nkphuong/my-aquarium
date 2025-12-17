/**
 * Authenticated HTTP Client
 *
 * Helper functions to make authenticated API calls using tokens from NextAuth session
 */

import { auth } from '@/infrastructure/auth'
import { createHttpClient } from './http-client'

/**
 * Get HTTP client with authentication token from session (Server-side)
 *
 * Use this in Server Components, Server Actions, or API routes
 *
 * @example
 * ```typescript
 * const client = await getAuthenticatedClient()
 * const users = await client.get('/users').send()
 * ```
 */
export async function getAuthenticatedClient() {
  const session = await auth()
  const client = createHttpClient(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  )

  if (session?.accessToken) {
    return client.get('').withAuth(session.accessToken)
  }

  return client
}

/**
 * Example: Fetch user data with authentication
 */
export async function fetchUserData(userId: string) {
  const client = await getAuthenticatedClient()
  return client.get(`/users/${userId}`).send()
}

/**
 * Example: Update user profile with authentication
 */
export async function updateUserProfile(userId: string, data: any) {
  const client = await getAuthenticatedClient()
  return client.put(`/users/${userId}`).withBody(data).send()
}
