'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Mail, Lock, Waves, Sparkles } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "@hookform/error-message"

const schema = yup
  .object({
    email: yup.string().required('Email is required').email('Please enter a valid email'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').max(200),
  })
  .required()

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      // Check for auth errors from server
      if (result?.error) {
        // NextAuth returns the error code/message in result.error
        // For CredentialsSignin errors, the message is in result.error
        setError('root', {
          type: 'server',
          message: result.error === 'CredentialsSignin'
            ? 'Invalid email or password'
            : result.error,
        })
        return
      }

      // Success - redirect to dashboard
      if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('root', {
        type: 'server',
        message: 'An unexpected error occurred. Please try again.',
      })
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
        <div className="relative mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean-mid to-ocean-deep rounded-2xl shadow-lg mb-4 animate-wiggle-slow">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ocean-deep to-ocean-mid bg-clip-text text-transparent mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ocean-mid" />
            Sign in to continue your aquatic journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5">
          {/* Server Error Display */}
          {errors.root && (
            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 animate-fade-in-up">
              <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {errors.root.message}
              </p>
            </div>
          )}

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
            <div className="flex justify-between items-center">
              <label
                className="block text-sm font-semibold text-slate-700 ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <Link
                className="text-sm font-medium text-ocean-mid hover:text-ocean-deep transition-colors"
                href="#"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Lock className="size-5 text-ocean-mid group-focus-within:text-ocean-deep transition-colors" />
              </div>
              <Input
                id="password"
                type="password"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:border-ocean-mid focus:bg-white focus:shadow-[0_0_0_4px_rgba(74,158,191,0.15)] transition-all duration-300"
                placeholder="Enter your password"
                {...register("password")}
              />
            </div>
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
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Diving in...
                </span>
              ) : (
                <span className="relative">Sign In</span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm text-slate-500 bg-white rounded-full">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-ocean-light hover:bg-sky-50 hover:shadow-md transition-all duration-300 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-semibold text-sm text-slate-700 group-hover:text-ocean-deep transition-colors">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-ocean-light hover:bg-sky-50 hover:shadow-md transition-all duration-300 group"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-semibold text-sm text-slate-700 group-hover:text-ocean-deep transition-colors">GitHub</span>
            </button>
          </div>
        </form>

        {/* Wave Divider */}
        <div className="relative mt-8 mb-4">
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

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-slate-500 text-sm">
            Don&apos;t have an account?
          </span>
          <Link
            className="relative ml-2 text-ocean-mid hover:text-ocean-deep font-bold text-sm transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(74,158,191,0.6)] inline-flex items-center gap-1"
            href="/register"
          >
            Sign up
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
