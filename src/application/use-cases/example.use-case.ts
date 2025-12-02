/**
 * Example Use Case
 *
 * Use cases orchestrate the flow of data and implement application-specific
 * business rules. They call domain entities and services to fulfill use cases.
 */

import { ExampleEntity } from '@/domain/entities/example.entity';
import { ExampleRepository } from '@/domain/repositories/example.repository';

export interface CreateExampleDTO {
  name: string;
}

export class CreateExampleUseCase {
  constructor(private readonly repository: ExampleRepository) {}

  async execute(dto: CreateExampleDTO): Promise<ExampleEntity> {
    // Generate ID (in real app, might use UUID)
    const id = Math.random().toString(36).substring(7);

    // Create domain entity
    const entity = new ExampleEntity(id, dto.name, new Date());

    // Persist using repository
    await this.repository.save(entity);

    return entity;
  }
}
