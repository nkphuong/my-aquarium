import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './config'
import { getService } from '@/infrastructure/di'

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        try {
          // Auto-resolve service with type safety!
          const authService = getService('AuthService')

          const result = await authService.login({ email, password })

          if (result.success && result.user) {
            // Return user data + tokens
            // NextAuth will store this in the JWT
            return {
              id: result.user.id,
              authId: result.user.authId,
              fullname: result.user.fullname,
              accessToken: result.accessToken!,
              refreshToken: result.refreshToken!,
              expiresIn: result.expiresIn!,
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in - save tokens to JWT
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresIn = user.expiresIn
        token.accessTokenExpires = Date.now() + (user.expiresIn || 3600) * 1000
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to refresh it
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      // Make tokens available in session
      if (token) {
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.error = token.error as string | undefined
      }
      return session
    },
  },
})

/**
 * Refresh Access Token
 *
 * Attempts to refresh the access token using the refresh token.
 * If refresh fails, marks the token as expired.
 */
async function refreshAccessToken(token: any) {
  try {
    // Get the auth service to refresh the token
    const authService = getService('AuthService')

    // TODO: Implement refreshToken method in AuthService
    // const result = await authService.refreshToken(token.refreshToken)

    // For now, just return token with error to force re-login
    console.error('[NextAuth] Token expired, refresh not implemented yet')
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }

    // When implemented:
    // if (result.success && result.accessToken) {
    //   return {
    //     ...token,
    //     accessToken: result.accessToken,
    //     accessTokenExpires: Date.now() + (result.expiresIn || 3600) * 1000,
    //     refreshToken: result.refreshToken ?? token.refreshToken,
    //   }
    // }
  } catch (error) {
    console.error('[NextAuth] Error refreshing token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export { authConfig }
