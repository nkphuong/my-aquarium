/**
 * Tank Response DTO
 *
 * Output data structure for tank operations.
 * Used by: Server Actions to serialize domain entities
 */
export interface TankResponse {
    id: number;
    name: string;
    width: number;
    height: number;
    length: number;
    userId: number;
    status?: string;
    avatar?: string;
    description?: string;
    setup_at?: string;
    type?: string;
    style?: string;
}

/**
 * Get Tanks Response DTO
 *
 * Response wrapper for fetching tanks list.
 */
export interface GetTanksResponse {
    success: boolean;
    tanks?: TankResponse[];
    error?: string;
}

/**
 * Create Tank Response DTO
 *
 * Response wrapper for creating a tank.
 */
export interface CreateTankResponse {
    success: boolean;
    tank?: TankResponse;
    error?: string;
}
