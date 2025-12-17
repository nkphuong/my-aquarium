'use client'

/**
 * NextAuth Session Provider
 *
 * Wraps the app with SessionProvider to enable useSession hook
 */

import { SessionProvider } from 'next-auth/react'

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
