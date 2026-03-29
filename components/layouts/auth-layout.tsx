'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { Waves } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  showSignInLink?: boolean
}

/**
 * Warm Aquatic Auth Layout
 * Split layout: left branding panel + right form panel
 */
export function AuthLayout({ children, showSignInLink = false }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-warm-cream flex-col items-center justify-center px-12 relative">
        <div className="text-center max-w-sm">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="size-12 flex items-center justify-center rounded-2xl bg-primary text-white shadow-md">
              <Waves className="size-7" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-primary">
              AquaHeart
            </span>
          </Link>

          <h2 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-4">
            Care That Comes
            <br />
            <span className="text-primary">from the Heart</span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xs mx-auto">
            Your fish are waiting for you. Give them the love they deserve.
          </p>

          <div className="mt-10 flex justify-center">
            <Waves className="size-10 text-primary/40" />
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Navigation */}
        <nav className="w-full px-6 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 lg:hidden group">
            <div className="size-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <Waves className="size-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">
              AquaHeart
            </span>
          </Link>

          {showSignInLink && (
            <div className="hidden sm:flex items-center gap-4 ml-auto">
              <span className="text-muted-foreground text-sm font-medium">
                Already have an account?
              </span>
              <Link
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-300 shadow-sm"
                href="/login"
              >
                Sign in
              </Link>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-6 w-full">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
