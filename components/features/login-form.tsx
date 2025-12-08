'use client'

/**
 * Login Form Component
 */

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '../../app/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const result = await loginAction(formData)
      if (result.success) {
        router.push('/dashboard')
        router.refresh()
      }
      return result
    },
    null
  )

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the aquarium dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="user@example.com"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="••••••••"
              disabled={isPending}
            />
          </div>

          {state && !state.success && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {state.error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-xs text-muted-foreground mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
            <p className="font-medium mb-1">Development Setup:</p>
            <p>Configure your NestJS backend URL in .env.local:</p>
            <code className="block mt-1 text-xs">
              NEXT_PUBLIC_API_URL=http://localhost:3001/api
            </code>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
