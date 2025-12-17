/**
 * Client-side Tank Types
 *
 * These are plain object types used by stores and components.
 * They represent the serialized data from server actions.
 *
 * Location: app/types/ (client layer)
 * Used by: app/stores/, components/
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
  setup_at: string
}

export interface GetTanksResponseDTO {
  success: boolean
  tanks?: Tank[]
  error?: string
}

export interface CreateTankRequestDTO {
  name: string
  width: number
  height: number
  length: number
}

export interface CreateTankResponseDTO {
  success: boolean
  tank?: Tank
  error?: string
}
