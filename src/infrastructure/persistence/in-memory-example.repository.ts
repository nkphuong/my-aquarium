/**
 * Example Repository Implementation
 *
 * This is a concrete implementation of the repository interface.
 * In a real application, this might use Prisma, Drizzle, or another ORM.
 */

import { ExampleEntity } from '@/domain/entities/example.entity';
import { ExampleRepository } from '@/domain/repositories/example.repository';

export class InMemoryExampleRepository implements ExampleRepository {
  private entities: Map<string, ExampleEntity> = new Map();

  async findById(id: string): Promise<ExampleEntity | null> {
    return this.entities.get(id) || null;
  }

  async findAll(): Promise<ExampleEntity[]> {
    return Array.from(this.entities.values());
  }

  async save(entity: ExampleEntity): Promise<void> {
    this.entities.set(entity.id, entity);
  }

  async delete(id: string): Promise<void> {
    this.entities.delete(id);
  }
}
