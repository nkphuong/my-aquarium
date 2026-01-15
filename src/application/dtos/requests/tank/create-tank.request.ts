/**
 * Create Tank Request DTO
 *
 * Input data for creating a new tank.
 * Used by: TankService.create(), Server Actions
 */
export interface CreateTankRequest {
    name: string;
    width: number;
    height: number;
    length: number;
    setup_at?: string;
    type?: string;
    style?: string;
    description?: string;
    status?: string;
    water_volume?: number;
    avatar?: string
}
