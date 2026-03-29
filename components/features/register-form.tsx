'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Loader2, Fish, Sparkles, Check } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { ErrorMessage } from "@hookform/error-message"
import { signIn } from 'next-auth/react'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (!agreedToTerms) {
      setServerError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setServerError(null)

    try {
      const result = await signIn('registerWithEmail', {
        name: data.name,
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setServerError(result.error === 'CredentialsSignin'
          ? 'Registration failed. Email may already be in use.'
          : result.error)
        return
      }

      if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="w-full animate-fade-in-up">
      {/* Card */}
      <div className="relative bg-white rounded-3xl shadow-[0_8px_40px_rgba(13,148,136,0.15)] p-8 md:p-10 border border-border/40 overflow-hidden">

        {/* Header with icon */}
        <div className="relative mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-4">
            <Fish className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            Join AquaHeart and start your journey
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="relative mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-destructive rounded-full mt-1.5 shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4">
          {/* Name Field */}
          <div className="space-y-2 group">
            <label
              className="block text-sm font-semibold text-slate-700 ml-1"
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <User className="size-5 text-primary group-focus-within:text-primary/80 transition-colors" />
              </div>
              <Input
                id="name"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(13,148,136,0.15)] transition-all duration-300"
                placeholder="John Doe"
                {...register("name")}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="text-sm text-destructive ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-destructive rounded-full" />
                  {message}
                </p>
              )}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2 group">
            <label
              className="block text-sm font-semibold text-slate-700 ml-1"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Mail className="size-5 text-primary group-focus-within:text-primary/80 transition-colors" />
              </div>
              <Input
                id="email"
                type="email"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(13,148,136,0.15)] transition-all duration-300"
                placeholder="your@email.com"
                {...register("email")}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p className="text-sm text-destructive ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-destructive rounded-full" />
                  {message}
                </p>
              )}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2 group">
            <label
              className="block text-sm font-semibold text-slate-700 ml-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Lock className="size-5 text-primary group-focus-within:text-primary/80 transition-colors" />
              </div>
              <Input
                id="password"
                type="password"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(13,148,136,0.15)] transition-all duration-300"
                placeholder="Create a strong password"
                {...register("password")}
              />
            </div>

            {/* Password Strength Indicators */}
            {password && (
              <div className="grid grid-cols-2 gap-2 mt-2 ml-1">
                <div className={`flex items-center gap-1.5 text-xs ${hasMinLength ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasMinLength ? 'text-primary' : 'text-muted-foreground/50'}`} />
                  8+ characters
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${hasLowercase ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasLowercase ? 'text-primary' : 'text-muted-foreground/50'}`} />
                  Lowercase letter
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${hasUppercase ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasUppercase ? 'text-primary' : 'text-muted-foreground/50'}`} />
                  Uppercase letter
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${hasNumber ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasNumber ? 'text-primary' : 'text-muted-foreground/50'}`} />
                  Number
                </div>
              </div>
            )}

            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => (
                <p className="text-sm text-destructive ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-destructive rounded-full" />
                  {message}
                </p>
              )}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2 group">
            <label
              className="block text-sm font-semibold text-slate-700 ml-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Lock className="size-5 text-primary group-focus-within:text-primary/80 transition-colors" />
              </div>
              <Input
                id="confirmPassword"
                type="password"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(13,148,136,0.15)] transition-all duration-300"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              render={({ message }) => (
                <p className="text-sm text-destructive ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-destructive rounded-full" />
                  {message}
                </p>
              )}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={`mt-0.5 size-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${agreedToTerms
                ? 'bg-primary border-primary text-white'
                : 'border-border hover:border-primary'
                }`}
            >
              {agreedToTerms && <Check className="w-3.5 h-3.5" />}
            </button>
            <label className="text-sm text-slate-500 leading-relaxed cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full py-4 px-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base shadow-[0_4px_20px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_30px_rgba(13,148,136,0.4)] transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden group"
            >
              {/* Animated shine effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              {isSubmitting ? (
                <span className="relative flex items-center justify-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="relative">Create Account</span>
              )}
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <span className="text-slate-500 text-sm">
            Already have an account?
          </span>
          <Link
            className="text-primary hover:text-primary/80 font-bold text-sm ml-2 transition-colors inline-flex items-center gap-1"
            href="/login"
          >
            Sign in
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
