import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { RegisterForm } from '@/components/features/register-form'
import { AuthLayout } from '@/components/layouts/auth-layout'

export default async function RegisterPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout showSignInLink={false}>
      <RegisterForm />
    </AuthLayout>
  )
}
