import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './config'
import { LoginUseCase } from '@/application/use-cases/login.use-case'
import { getContainer, DI_TOKENS } from '@/infrastructure/di'

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        try {
          // Use Dependency Injection (TSyringe) to resolve the use case
          const container = getContainer()
          const loginUseCase = container.resolve<LoginUseCase>(DI_TOKENS.LoginUseCase)

          const result = await loginUseCase.execute({ email, password })

          if (result.success && result.user) {
            return {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
})

export { authConfig }
