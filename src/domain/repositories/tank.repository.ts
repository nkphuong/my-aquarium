import { Tank } from "../entities/tank.entity";


export interface TankRepository {
    // Define methods for tank data access
    findAllMyTanks(jwt: string): Promise<Tank[]>;
}