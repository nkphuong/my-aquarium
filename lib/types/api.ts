/**
 * API Types - Response Wrappers
 *
 * Generic API response types used across all accessors.
 * These are transport-layer concerns, not domain types.
 */

import type { Tank } from './tank'
import type { User } from './user'

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

/**
 * Paginated Response wrapper
 */
export interface PaginatedResponse<T> {
    success: boolean
    data?: T[]
    total?: number
    page?: number
    pageSize?: number
    error?: string
}

// Tank-specific responses
export interface GetTanksResponse {
    success: boolean
    tanks?: Tank[]
    error?: string
}

export interface CreateTankResponse {
    success: boolean
    tank?: Tank
    error?: string
}

// Auth-specific responses
export interface AuthResponse {
    success: boolean
    user?: User
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
    message?: string
    error?: string
}
