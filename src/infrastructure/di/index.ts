/**
 * Dependency Injection Module
 *
 * Central export point for DI-related functionality.
 *
 * Quick Start:
 * ```typescript
 * import { getService } from '@/infrastructure/di';
 *
 * const authService = getService('AuthService');
 * await authService.login({ email, password });
 * ```
 */

export { container, getContainer, DI_TOKENS } from './container'
export { getService, resolve, inject } from './helpers'
export type { ServiceMap } from './container'
