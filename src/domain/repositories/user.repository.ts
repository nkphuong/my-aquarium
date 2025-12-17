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
export interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  loginWithEmailAndPassword(email: string, password: string): Promise<LoginResult | null>;
  save(user: User): Promise<void>;
}
