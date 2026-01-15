/**
 * Auth Service
 *
 * Handles authentication-related operations including login, logout, and password management.
 */

import { UserRepository } from '@/domain/repositories/user.repository';
import { AuthError } from '@/domain/errors/auth.errors';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/application/dtos/';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) { }

  /**
   * Authenticate a user with email and password
   * @throws {AuthError} on invalid credentials or server error
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    // Validate email format
    if (!this.isValidEmail(request.email)) {
      throw new AuthError('Invalid email format', 'INVALID_EMAIL')
    }

    // Login via repository - throws AuthError on failure
    const loginResult = await this.userRepository.loginWithEmailAndPassword(
      request.email,
      request.password
    );

    return {
      success: true,
      user: {
        id: loginResult.user.id,
        fullname: loginResult.user.fullname
      },
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
      expiresIn: loginResult.expiresIn
    };
  }

  /**
   * Register a new user
   * @throws {AuthError} on email exists or validation error
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    // Validate email format
    if (!this.isValidEmail(request.email)) {
      throw new AuthError('Invalid email format', 'INVALID_EMAIL')
    }

    // Register via repository - throws AuthError on failure
    const registerResult = await this.userRepository.registerWithEmailAndPassword(
      request.email,
      request.password,
      request.name
    );

    return {
      success: true,
      user: {
        id: registerResult.user.id,
        fullname: registerResult.user.fullname
      },
      accessToken: registerResult.accessToken,
      refreshToken: registerResult.refreshToken,
      expiresIn: registerResult.expiresIn
    };
  }

  /**
   * Refresh access token
   * @throws {AuthError} on invalid/expired token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Refresh via repository - throws AuthError on failure
    const refreshTokenResult = await this.userRepository.refreshToken(refreshToken);

    return {
      success: true,
      user: {
        id: refreshTokenResult.user.id,
        fullname: refreshTokenResult.user.fullname
      },
      accessToken: refreshTokenResult.accessToken,
      refreshToken: refreshTokenResult.refreshToken,
      expiresIn: refreshTokenResult.expiresIn
    };
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
