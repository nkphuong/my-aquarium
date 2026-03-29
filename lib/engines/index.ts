/**
 * Engines - Business Logic Layer (IDesign)
 *
 * This layer contains all business rules, validation, and domain logic.
 * Engines sit between Managers (Server Actions) and Accessors (Data Access).
 *
 * IDesign Principles:
 * - Engines are more volatile than Accessors, less volatile than Managers
 * - Engines are reusable across different Managers
 * - Engines contain no data access logic (that's for Accessors)
 * - Engines contain no orchestration logic (that's for Managers)
 *
 * @module lib/engines
 */

// Tank business logic
export { tankEngine } from './tank.engine'
export type { ValidationResult, EnrichedTank } from './tank.engine'

// Auth business logic
export { authEngine } from './auth.engine'
export type { PasswordStrength, PasswordStrengthResult } from './auth.engine'

// Dashboard business logic
export { dashboardEngine } from './dashboard.engine'
export type {
    TankHealthStatus,
    TankCardProps,
    DashboardStats,
} from './dashboard.engine'

// Chat business logic
export { chatEngine } from './chat.engine'
