/**
 * Root Page
 *
 * Redirects to dashboard if authenticated, otherwise to login.
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { isMockMode } from '@/lib/mock-data'

export default async function RootPage() {
  if (isMockMode()) {
    redirect('/dashboard')
  }

  const session = await auth()
  if (session?.user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
