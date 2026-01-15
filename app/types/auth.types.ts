/**
 * Auth Types for Client-Side
 *
 * These are plain object types used across the client/server boundary.
 * Server Actions serialize class instances to these plain objects.
 */

/**
 * Registration request DTO
 */
export interface RegisterRequestDTO {
  name: string
  email: string
  password: string
}

/**
 * Registration response DTO
 */
export interface RegisterResponseDTO {
  success: boolean
  message?: string
  error?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

/**
 * Login request DTO
 */
export interface LoginRequestDTO {
  email: string
  password: string
}

/**
 * Login response DTO
 */
export interface LoginResponseDTO {
  success: boolean
  message?: string
  error?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

/**
 * Client-side user type (serialized from session)
 */
export interface ClientUser {
  id: string
  name: string | null
  email: string | null
  image?: string | null
}
