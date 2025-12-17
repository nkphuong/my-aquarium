/**
 * Authentication Types
 *
 * All auth-related types in one place
 */
import { User } from '@/domain/entities/user.entity'
/**
 * Authentication tokens returned from backend
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * Complete login response (user + tokens)
 */
export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

