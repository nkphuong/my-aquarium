import { Tank } from "../entities/tank.entity";
import type { CreateTankRequest } from "@/application/dtos/requests";


export interface TankRepository {
    // Define methods for tank data access
    findAllMyTanks(jwt: string, keyword?: string, type?: string, style?: string): Promise<Tank[]>;

    create(request: CreateTankRequest, jwt: string): Promise<Tank>;
}