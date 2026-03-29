/**
 * NextAuth v5 Type Augmentation
 *
 * For NextAuth v5 (beta), types come from @auth/core/types.
 * We augment both next-auth and @auth/core modules.
 */

import '@auth/core/types'
import '@auth/core/jwt'
import 'next-auth'

declare module '@auth/core/types' {
  interface Session {
    accessToken?: string
    error?: string
    user: {
      id: number  // Client-facing: converted from string in session callback
      email?: string
      fullname?: string
      image?: string
      name?: string
    }
  }

  interface User {
    id: string  // NextAuth internal: string (converted from domain number)
    email?: string
    fullname?: string
    image?: string
    name?: string
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string  // NextAuth internal: string (converted from domain number)
    email?: string
    fullname?: string
    image?: string
    name?: string
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
    accessTokenExpires?: number
    error?: string
  }
}

// Also augment next-auth for backward compatibility
declare module 'next-auth' {
  export interface Session {
    accessToken?: string
    error?: string
    user: {
      id: number  // Client-facing: converted from string in session callback
      email?: string
      fullname?: string
      image?: string
      name?: string
    }
  }

  export interface User {
    id: string  // NextAuth internal: string (converted from domain number)
    email?: string
    fullname?: string
    image?: string
    name?: string
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string  // NextAuth internal: string (converted from domain number)
    email?: string
    fullname?: string
    image?: string
    name?: string
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
    accessTokenExpires?: number
    error?: string
  }
}
