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
import { AuthService, TankService } from '@/application/services/'

// Infrastructure
import { NestJSUserRepository, NestJSTankRepository } from '@/srcinfrastructure/persistence/nestjs'
import { TankRepository } from '@/srcdomain/repositories/tank.repository'

// Tokens for dependency injection
export const DI_TOKENS = {
  UserRepository: Symbol.for('UserRepository'),
  AuthService: Symbol.for('AuthService'),

  TankRepository: Symbol.for('TankRepository'),
  TankService: Symbol.for('TankService'),
} as const

// Type mapping for getService helper
export type ServiceMap = {
  UserRepository: UserRepository
  AuthService: AuthService

  TankRepository: TankRepository
  TankService: TankService // Replace 'any' with actual TankService type when available
}

/**
 * Configure and register all dependencies
 */
export function configureDependencies(): void {
  // Environment-based repository selection

  container.registerSingleton<TankRepository>(
    DI_TOKENS.TankRepository,
    NestJSTankRepository
  )


  container.registerSingleton<UserRepository>(
    DI_TOKENS.UserRepository,
    NestJSUserRepository
  )

  // Register Services (transient - new instance each time)
  container.register<AuthService>(
    DI_TOKENS.AuthService,
    {
      useFactory: (c) => {
        const userRepo = c.resolve<UserRepository>(DI_TOKENS.UserRepository)
        return new AuthService(userRepo)
      },
    }
  )

  container.register<TankService>(
    DI_TOKENS.TankService,
    {
      useFactory: (c) => {
        const tankRepo = c.resolve<TankRepository>(DI_TOKENS.TankRepository)
        return new TankService(tankRepo)
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
