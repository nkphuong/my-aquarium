/**
 * DI Helper Functions
 *
 * Easy-to-use dependency injection helpers similar to NestJS/Laravel
 */

import { container } from 'tsyringe';
import { DI_TOKENS, ServiceMap, getContainer as initContainer } from './container';

/**
 * Get a service instance (auto-resolves dependencies)
 * Type-safe and easy to use!
 *
 * Usage in Server Actions:
 * ```typescript
 * const authService = getService('AuthService');
 * await authService.login({ email, password });
 * ```
 */
export function getService<K extends keyof ServiceMap>(serviceName: K): ServiceMap[K] {
  // Initialize container if not already done
  initContainer();

  const token = DI_TOKENS[serviceName];
  return container.resolve<ServiceMap[K]>(token);
}

/**
 * Type-safe service getter
 *
 * Usage:
 * ```typescript
 * import { AuthService } from '@/application/services/auth.service';
 * const authService = resolve(AuthService);
 * ```
 */
export function resolve<T>(serviceClass: new (...args: any[]) => T): T {
  return container.resolve<T>(serviceClass as any);
}

/**
 * Manual injection helper for complex cases
 */
export function inject<T>(token: symbol): T {
  return container.resolve<T>(token);
}

/**
 * Get container instance (for advanced usage)
 */
export function getContainer() {
  return container;
}
