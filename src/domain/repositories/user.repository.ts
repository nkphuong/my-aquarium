/**
 * User Repository Interface
 *
 * Defines the contract for user data persistence.
 */

import { User } from '../entities/user.entity';

/**
 * Login result returned from authentication endpoints
 * Includes user data and authentication tokens
 */
export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}


export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  /**
   * Login with email and password
   * @throws {AuthError} on invalid credentials or network error
   */
  loginWithEmailAndPassword(email: string, password: string): Promise<AuthResult>;
  /**
   * Register with email and password
   * @throws {AuthError} on email already exists or validation error
   */
  registerWithEmailAndPassword(email: string, password: string, name?: string): Promise<AuthResult>;
  /**
   * Refresh access token
   * @throws {AuthError} on invalid/expired token
   */
  refreshToken(refreshToken: string): Promise<AuthResult>;
  save(user: User): Promise<void>;
}
