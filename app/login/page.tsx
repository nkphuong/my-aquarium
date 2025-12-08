/**
 * Login Page
 */

import { LoginForm } from '@/components/features/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            🐠 Aquarium Control
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your aquarium system
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
