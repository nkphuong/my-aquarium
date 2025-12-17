'use client'

/**
 * Login Form Component - Matches design/user_login/screen.png exactly
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setIsPending(false)
      } else if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('An error occurred. Please try again.')
      setIsPending(false)
    }
  }

  return (
    <div className="w-full max-w-[480px] rounded-lg bg-card/60 backdrop-blur-xl border border-border shadow-2xl overflow-hidden animate-[fade-in-up_0.6s_ease-out_forwards]">
      <div className="p-8 md:p-10 flex flex-col gap-6">
        {/* Header with icon and title */}
        <div className="text-center flex flex-col items-center gap-2 mb-2">
          <div className="size-12 rounded-full bg-primary flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <span className="material-symbols-outlined icon-lg text-primary-foreground">
              waves
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Dive Back In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your tanks.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined icon-sm text-muted-foreground">
                  mail
                </span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full h-12 pl-11 pr-4 rounded-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground text-sm"
                placeholder="user@example.com"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Link
                href="#"
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined icon-sm text-muted-foreground">
                  lock
                </span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full h-12 pl-11 pr-4 rounded-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground text-sm"
                placeholder="••••••••"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl">
              {error}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 mt-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base tracking-wide shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isPending ? 'Logging in...' : 'Log In'}</span>
            {!isPending && (
              <span className="material-symbols-outlined icon-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-xs uppercase tracking-wider text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social login buttons */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            aria-label="Sign in with Google"
            className="size-12 rounded-full bg-card border border-input flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <svg className="size-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Sign in with Apple"
            className="size-12 rounded-full bg-card border border-input flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <span className="material-symbols-outlined icon-md">ios</span>
          </button>
        </div>
      </div>

      {/* Mobile sign-up footer */}
      <div className="p-4 bg-[#020617] text-center sm:hidden">
        <p className="text-sm">
          Don&apos;t have an account?{' '}
          <Link href="#" className="font-bold text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
