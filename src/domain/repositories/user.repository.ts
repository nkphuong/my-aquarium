/**
 * User Repository Interface
 *
 * Defines the contract for user data persistence.
 */

import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByEmailAndPassword(email: Email, password: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
