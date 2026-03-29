/**
 * Tank Types - Single Source of Truth
 *
 * All tank-related types consolidated in one place.
 * Used by: Accessors, Actions, Components
 */

export interface Tank {
    id: number
    name: string
    width: number
    height: number
    length: number
    userId: number
    status?: string
    avatar?: string
    description?: string
    setupAt?: string
    type?: string
    style?: string
}

export interface CreateTankInput {
    name: string
    width: number
    height: number
    length: number
    setupAt?: string
    type?: string
    style?: string
    description?: string
    status?: string
    waterVolume?: number
    avatar?: string
}

export interface TankFilters {
    keyword?: string
    search?: string  // Alias for keyword (from URL param ?q=)
    type?: string
    style?: string
}
