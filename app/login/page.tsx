/**
 * Login Page - Matches design/user_login/screen.png exactly
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/infrastructure/auth'
import { LoginForm } from '@/components/features/login-form'

export default async function LoginPage() {
  // Check if user is already authenticated
  const session = await auth()

  // Redirect to dashboard if already logged in
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
      {/* Background Layer - Blurred underwater image */}
      <div className="absolute inset-0 z-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background z-10" />
        {/* Blurred underwater image - using local asset */}
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/login-background.jpg")',
            filter: 'blur(4px)',
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex w-full h-full flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined icon-md">water_drop</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Aquarist Manager</h2>
          </div>
          <div className="hidden sm:flex gap-4">
            <span className="text-sm font-medium opacity-70 self-center">
              Don&apos;t have an account?
            </span>
            <Link
              href="#"
              className="text-sm font-bold text-primary hover:underline self-center"
            >
              Sign Up
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <LoginForm />
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-muted-foreground">
          <p>© 2024 Aquarist Manager. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
