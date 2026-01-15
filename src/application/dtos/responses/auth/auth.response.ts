/**
 * Auth Response DTO
 *
 * Output data for successful login or register or refresh token.
 * Includes user data and authentication tokens.
 */
export interface AuthResponse {
  success: boolean;

  user?: {
    id: string;
    fullname?: string;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;

  message?: string;
  error?: string;
}
