/**
 * Register Request DTO
 *
 * Input data for user register.
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}
