'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: ReactNode
  showSignInLink?: boolean
}

/**
 * Serene Aquarium Auth Layout
 * Clean layout with peaceful static aquarium background in Disney/Pixar style
 */
export function AuthLayout({ children, showSignInLink = false }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Static Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/login-background.png"
          alt="Peaceful freshwater aquarium scene"
          fill
          priority
          quality={95}
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="w-full px-6 py-5 lg:px-12 flex justify-between items-center relative z-20">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Animated Fish Logo */}
          <div className="size-11 text-white drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="animate-wiggle-slow">
              <path d="M38 24C38 24 32 16 20 16C8 16 4 24 4 24C4 24 8 32 20 32C32 32 38 24 38 24Z" />
              <circle cx="14" cy="24" r="3" fill="#1E6B8C" />
              <circle cx="13" cy="23" r="1" fill="white" />
              <path d="M40 24L48 18V30L40 24Z" />
            </svg>
          </div>
          <span className="font-bold text-2xl tracking-tight text-white drop-shadow-lg">
            AquaHeart
          </span>
        </Link>

        {showSignInLink && (
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-white/90 text-sm font-medium drop-shadow-sm">
              Already have an account?
            </span>
            <Link
              className="px-6 py-2.5 rounded-full bg-white/25 backdrop-blur-md text-white font-semibold text-sm hover:bg-white/35 hover:scale-105 transition-all duration-300 border border-white/40 shadow-lg"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Text - Only on desktop, left side */}
      <div className="hidden lg:flex absolute left-12 xl:left-16 top-[40%] -translate-y-1/2 flex-col gap-4 z-10 max-w-sm">
        <h2 className="text-4xl xl:text-5xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] leading-tight">
          Care That Comes
          <br />
          <span className="text-cyan-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">from the Heart</span>
        </h2>
        <p className="text-white/90 text-base drop-shadow-md leading-relaxed max-w-xs">
          Your fish are waiting for you. Give them the love they deserve.
        </p>

      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center lg:justify-end p-6 lg:pr-12 xl:pr-20 2xl:pr-32 relative z-10 w-full">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  )
}
