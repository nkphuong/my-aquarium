
import { TankRepository } from '@/domain/repositories'
import { Tank } from '@/srcdomain/entities/tank.entity';
import type { CreateTankRequest } from '@/application/dtos/requests';

export class TankService {
    constructor(private readonly tankRepository: TankRepository) { }

    async findAllMyTanks(jwt: string, keyword?: string, type?: string, style?: string): Promise<Tank[]> {
        return this.tankRepository.findAllMyTanks(jwt, keyword, type, style);
    }

    async create(request: CreateTankRequest, jwt: string): Promise<Tank> {
        return this.tankRepository.create(request, jwt);
    }
}