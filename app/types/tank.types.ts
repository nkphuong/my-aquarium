/**
 * Client-side Tank Types
 *
 * These are plain object types used by stores and components.
 * They represent the serialized data from server actions.
 *
 * Location: app/types/ (client layer)
 * Used by: app/stores/, components/
 */

/**
 * Tank type for client-side usage.
 * Mirrors TankResponse from application layer but kept here
 * for cases where components don't need the full DTO structure.
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
  setup_at?: string
  type?: string
  style?: string
}

// Re-export DTOs from application layer for convenience
// Components/stores can import from here or directly from @/application/dtos
export type {
  CreateTankRequest,
  GetTanksResponse,
  CreateTankResponse,
  TankResponse
} from '@/application/dtos'
