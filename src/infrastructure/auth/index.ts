import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './config'
import { getService } from '@/infrastructure/di'
import { AuthError } from '@/domain/errors/auth.errors'

/**
 * Custom error class for auth errors with message
 */
class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super(message)
    this.message = message
  }
}

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
          const authService = getService('AuthService')
          const result = await authService.login({ email, password })
          console.log(result)
          if (result.success && result.user) {
            return {
              id: result.user.id,
              fullname: result.user.fullname,
              accessToken: result.accessToken!,
              refreshToken: result.refreshToken!,
              expiresIn: result.expiresIn!,

            }
          }

          return null
        } catch (error) {
          // Propagate AuthError message to the client
          if (error instanceof AuthError) {
            throw new CustomAuthError(error.message)
          }

          // Handle generic errors
          console.error('[NextAuth] Login error:', error)
          throw new CustomAuthError('Login failed. Please try again.')
        }
      },
      name: 'credentials',
    }),
    Credentials({
      id: 'registerWithEmail',
      type: 'credentials',
      name: 'registerWithEmail',
      credentials: {
        name: { label: "Name", type: "text", placeholder: "jsmith" },
        email: { label: "Email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { name, email, password } = credentials as {
          name?: string
          email: string
          password: string
        }

        try {
          const authService = getService('AuthService')
          const result = await authService.register({ name, email, password })

          if (result.success && result.user) {
            return {
              id: result.user.id,
              fullname: result.user.fullname,
              accessToken: result.accessToken!,
              refreshToken: result.refreshToken!,
              expiresIn: result.expiresIn!,
            }
          }

          return null
        } catch (error) {
          // Propagate AuthError message to the client
          if (error instanceof AuthError) {
            throw new CustomAuthError(error.message)
          }

          // Handle generic errors
          console.error('[NextAuth] Register error:', error)
          throw new CustomAuthError('Registration failed. Please try again.')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in - save tokens to JWT
      if (user) {
        console.log('[NextAuth JWT] Initial sign in - saving tokens')
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresIn = user.expiresIn
        token.accessTokenExpires = Date.now() + (user.expiresIn || 3600) * 1000
        console.log('[NextAuth JWT] Token expires at:', new Date(token.accessTokenExpires as number).toISOString())
      }
      console.log(token)
      console.log(user)
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        const timeLeft = Math.floor(((token.accessTokenExpires as number) - Date.now()) / 1000)
        console.log(`[NextAuth JWT] Token still valid - ${timeLeft}s remaining`)
        return token
      }

      // Access token has expired, try to refresh it
      console.log('[NextAuth JWT] ⚠️ Token expired! Attempting refresh...')
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

    const result = await authService.refreshToken(token.refreshToken)

    if (result.success && result.accessToken) {
      const newExpiry = Date.now() + (result.expiresIn || 3600) * 1000
      return {
        ...token,
        accessToken: result.accessToken,
        accessTokenExpires: newExpiry,
        refreshToken: result.refreshToken ?? token.refreshToken,
        error: undefined, // Clear any previous errors
      }
    }

    console.error('[NextAuth Refresh] ❌ Refresh failed - no access token in response')
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  } catch (error) {
    console.error('[NextAuth Refresh] ❌ Error refreshing token:', error)
    if (error instanceof Error) {
      console.error('[NextAuth Refresh] Error message:', error.message)
    }
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export { authConfig }
