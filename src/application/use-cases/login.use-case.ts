/**
 * Login Use Case
 *
 * Handles user authentication logic.
 */

import { Email } from '@/domain/value-objects/email';
import { UserRepository } from '@/domain/repositories/user.repository';
import { LoginDTO, AuthResultDTO } from '../dtos/auth.dto';

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: LoginDTO): Promise<AuthResultDTO> {
    try {
      // Validate email format
      const email = new Email(dto.email);

      // Find user by email and password
      const user = await this.userRepository.findByEmailAndPassword(
        email,
        dto.password
      );

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email.getValue(),
          name: user.name,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }
}
