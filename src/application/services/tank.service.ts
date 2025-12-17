import { TankRepository } from '@/domain/repositories'
import { Tank } from '@/srcdomain/entities/tank.entity';

export class TankService {
    constructor(private readonly tankRepository: TankRepository) { }

    async findAllMyTanks(jwt: string): Promise<Tank[]> {
        return this.tankRepository.findAllMyTanks(jwt);
    }
}