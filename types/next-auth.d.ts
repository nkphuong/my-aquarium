/**
 * NextAuth Type Augmentation
 *
 * Extends NextAuth types to include custom fields like tokens
 */

import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    error?: string
  }

  interface User {
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
    accessTokenExpires?: number
    error?: string
  }
}
