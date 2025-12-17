'use client'

/**
 * Session Monitor
 *
 * Monitors the user session and shows a toast notification when:
 * - Token expires
 * - Token refresh fails
 *
 * Automatically redirects to login when session becomes invalid.
 */

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function SessionMonitor() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const hasShownToast = useRef(false)

  useEffect(() => {
    // Check if session has an error (token expired or refresh failed)
    if (session?.error === 'RefreshAccessTokenError' && !hasShownToast.current) {
      hasShownToast.current = true

      // Show toast notification
      toast.error('Session Expired', {
        description: 'Your session has expired. Please log in again.',
        duration: 5000,
      })

      // Sign out and redirect to login after a short delay
      setTimeout(async () => {
        await signOut({ callbackUrl: '/login', redirect: true })
      }, 2000)
    }
  }, [session, router])

  // Reset the flag when session becomes valid again
  useEffect(() => {
    if (session && !session.error) {
      hasShownToast.current = false
    }
  }, [session])

  return null // This component doesn't render anything
}
