/**
 * Types - Single Source of Truth
 *
 * All types exported from one place.
 * Import from: @/lib/types
 */

// Domain types
export type { Tank, CreateTankInput, TankFilters } from './tank'
export type { User } from './user'
export type { LoginInput, RegisterInput, AuthResult, AuthTokens } from './auth'

// API response types
export type {
    ApiResponse,
    PaginatedResponse,
    GetTanksResponse,
    CreateTankResponse,
    AuthResponse,
} from './api'
