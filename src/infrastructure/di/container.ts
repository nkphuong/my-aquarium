/**
 * Dependency Injection Container Configuration
 *
 * Uses TSyringe for dependency injection.
 * This is the composition root where all dependencies are registered.
 */

import 'reflect-metadata'
import { container } from 'tsyringe'

// Domain
import type { UserRepository } from '@/domain/repositories/user.repository'

// Application
import { LoginUseCase } from '@/application/use-cases/login.use-case'

// Infrastructure
import { NestJSUserRepository } from '@/infrastructure/persistence/nestjs-user.repository'
import { InMemoryUserRepository } from '@/infrastructure/persistence/in-memory-user.repository'

// Tokens for dependency injection
export const DI_TOKENS = {
  UserRepository: Symbol.for('UserRepository'),
  LoginUseCase: Symbol.for('LoginUseCase'),
} as const

/**
 * Configure and register all dependencies
 */
export function configureDependencies(): void {
  // Environment-based repository selection
  const useInMemory = process.env.NEXT_PUBLIC_USE_IN_MEMORY === 'true'

  // Register Repositories
  if (useInMemory) {
    container.registerSingleton<UserRepository>(
      DI_TOKENS.UserRepository,
      InMemoryUserRepository
    )
  } else {
    container.registerSingleton<UserRepository>(
      DI_TOKENS.UserRepository,
      NestJSUserRepository
    )
  }

  // Register Use Cases (transient - new instance each time)
  container.register<LoginUseCase>(
    DI_TOKENS.LoginUseCase,
    {
      useFactory: (c) => {
        const userRepo = c.resolve<UserRepository>(DI_TOKENS.UserRepository)
        return new LoginUseCase(userRepo)
      },
    }
  )
}

// Initialize container
let isConfigured = false

export function getContainer() {
  if (!isConfigured) {
    configureDependencies()
    isConfigured = true
  }
  return container
}

// Export for easy access
export { container }
