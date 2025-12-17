/**
 * Auth Service
 *
 * Handles authentication-related operations including login, logout, and password management.
 */

import { UserRepository } from '@/domain/repositories/user.repository';
import { LoginRequest } from '@/application/dtos/requests/auth/login.request';
import { LoginResponse } from '@/application/dtos/responses/auth/login.response';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Authenticate a user with email and password
   * Returns LoginResponse with user data on success
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    // Validate email format
    if (!this.isValidEmail(request.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Login and get user + tokens
    const loginResult = await this.userRepository.loginWithEmailAndPassword(
      request.email,
      request.password
    );

    if (!loginResult) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    return {
      success: true,
      user: {
        id: loginResult.user.id,
        authId: loginResult.user.authId,
        fullname: loginResult.user.fullname
      },
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
      expiresIn: loginResult.expiresIn
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
