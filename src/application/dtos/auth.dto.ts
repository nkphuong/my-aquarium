/**
 * Authentication DTOs
 *
 * Data Transfer Objects for authentication use cases.
 */

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResultDTO {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}
