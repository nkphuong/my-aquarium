/**
 * Login Response DTO
 *
 * Output data for successful login.
 * Includes user data and authentication tokens.
 */
export interface LoginResponse {
  success: boolean;
  
  user?: {
    id: string;
    authId: string;
    fullname?: string;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;

  message?: string;
  error?: string;
}
