import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { LoginForm } from '@/components/features/login-form'
import { AuthLayout } from '@/components/layouts/auth-layout'

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout showSignInLink={false}>
      <LoginForm />
    </AuthLayout>
  )
}
