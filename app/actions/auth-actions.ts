'use server'

/**
 * Authentication Server Actions
 *
 * Uses NextAuth.js v5 with NestJS backend.
 */

import { signIn, signOut } from '@/infrastructure/auth'
import { AuthError } from 'next-auth'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }
    return {
      success: false,
      error: 'An error occurred during login',
    }
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' })
}
