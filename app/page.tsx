/**
 * Root Page
 *
 * Redirects to dashboard if authenticated, otherwise to login.
 */

import { redirect } from 'next/navigation'
import { auth } from '@/infrastructure/auth'

export default async function RootPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
