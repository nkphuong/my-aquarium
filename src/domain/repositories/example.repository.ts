/**
 * Example Repository Interface
 *
 * Repositories define the contract for data persistence.
 * The actual implementation lives in the infrastructure layer.
 */

import { ExampleEntity } from '../entities/example.entity';

export interface ExampleRepository {
  findById(id: string): Promise<ExampleEntity | null>;
  findAll(): Promise<ExampleEntity[]>;
  save(entity: ExampleEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
