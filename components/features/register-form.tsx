'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Loader2, Fish, Sparkles, Check } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "@hookform/error-message"
import { signIn } from 'next-auth/react'

const schema = yup
  .object({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: yup.string().required('Email is required').email('Please enter a valid email'),
    password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: yup.string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required()

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

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
    resolver: yupResolver(schema),
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
      })
      // if (result?.ok) {
      router.push('/dashboard')
      // }

    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="w-full animate-fade-in-up">
      {/* Glass Card with enhanced styling - Force light mode */}
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(30,107,140,0.25)] p-8 md:p-10 border border-white/80 overflow-hidden">
        {/* Decorative bubbles in card */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-200/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sky-200/40 rounded-full blur-3xl" />

        {/* Header with icon */}
        <div className="relative mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean-mid to-ocean-deep rounded-2xl shadow-lg mb-4 animate-wiggle-slow">
            <Fish className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ocean-deep to-ocean-mid bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ocean-mid" />
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
                <User className="size-5 text-ocean-mid group-focus-within:text-ocean-deep transition-colors" />
              </div>
              <Input
                id="name"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:border-ocean-mid focus:bg-white focus:shadow-[0_0_0_4px_rgba(74,158,191,0.15)] transition-all duration-300"
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
                <Mail className="size-5 text-ocean-mid group-focus-within:text-ocean-deep transition-colors" />
              </div>
              <Input
                id="email"
                type="email"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:border-ocean-mid focus:bg-white focus:shadow-[0_0_0_4px_rgba(74,158,191,0.15)] transition-all duration-300"
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
                <Lock className="size-5 text-ocean-mid group-focus-within:text-ocean-deep transition-colors" />
              </div>
              <Input
                id="password"
                type="password"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:border-ocean-mid focus:bg-white focus:shadow-[0_0_0_4px_rgba(74,158,191,0.15)] transition-all duration-300"
                placeholder="Create a strong password"
                {...register("password")}
              />
            </div>

            {/* Password Strength Indicators */}
            {password && (
              <div className="grid grid-cols-2 gap-2 mt-2 ml-1">
                <div className={`flex items-center gap-1.5 text-xs ${hasMinLength ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-muted-foreground/50'}`} />
                  8+ characters
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${hasLowercase ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasLowercase ? 'text-emerald-600' : 'text-muted-foreground/50'}`} />
                  Lowercase letter
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${hasUppercase ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasUppercase ? 'text-emerald-600' : 'text-muted-foreground/50'}`} />
                  Uppercase letter
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${hasNumber ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-600' : 'text-muted-foreground/50'}`} />
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
                <Lock className="size-5 text-ocean-mid group-focus-within:text-ocean-deep transition-colors" />
              </div>
              <Input
                id="confirmPassword"
                type="password"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:border-ocean-mid focus:bg-white focus:shadow-[0_0_0_4px_rgba(74,158,191,0.15)] transition-all duration-300"
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
                ? 'bg-ocean-mid border-ocean-mid text-white'
                : 'border-border hover:border-ocean-mid'
                }`}
            >
              {agreedToTerms && <Check className="w-3.5 h-3.5" />}
            </button>
            <label className="text-sm text-slate-500 leading-relaxed cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
              I agree to the{' '}
              <Link href="/terms" className="text-ocean-mid hover:text-ocean-deep font-medium transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-ocean-mid hover:text-ocean-deep font-medium transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full py-4 px-6 rounded-full bg-gradient-to-r from-ocean-deep to-ocean-mid hover:from-ocean-mid hover:to-ocean-deep text-white font-bold text-base shadow-[0_4px_20px_rgba(30,107,140,0.4)] hover:shadow-[0_6px_30px_rgba(30,107,140,0.5)] transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden group"
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

        {/* Wave Divider */}
        <div className="relative mt-6 mb-4">
          <svg
            viewBox="0 0 400 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-6 text-ocean-mid/40"
            preserveAspectRatio="none"
          >
            <path
              d="M0 12 Q 50 4 100 12 T 200 12 T 300 12 T 400 12"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="animate-wave-line"
            />
            <path
              d="M0 18 Q 50 10 100 18 T 200 18 T 300 18 T 400 18"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
              className="animate-wave-line"
              style={{ animationDelay: '-1s' }}
            />
          </svg>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-slate-500 text-sm">
            Already have an account?
          </span>
          <Link
            className="text-ocean-mid hover:text-ocean-deep font-bold text-sm ml-2 transition-colors inline-flex items-center gap-1"
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
