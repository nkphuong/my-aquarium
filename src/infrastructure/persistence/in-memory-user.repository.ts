/**
 * In-Memory User Repository
 *
 * Simple in-memory implementation for development/demo purposes.
 * Replace with a real database implementation (Prisma, etc.) in production.
 */

import { User } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email';
import { UserRepository } from '@/domain/repositories/user.repository';

// Demo user data
const demoUsers = new Map<string, { user: User; password: string }>([
  [
    'admin@aquarium.com',
    {
      user: new User(
        '1',
        new Email('admin@aquarium.com'),
        'Admin User',
        new Date()
      ),
      password: 'admin123', // In production, this would be hashed
    },
  ],
  [
    'user@aquarium.com',
    {
      user: new User(
        '2',
        new Email('user@aquarium.com'),
        'Regular User',
        new Date()
      ),
      password: 'user123',
    },
  ],
]);

export class InMemoryUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    for (const [_, data] of demoUsers) {
      if (data.user.id === id) {
        return data.user;
      }
    }
    return null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const data = demoUsers.get(email.getValue());
    return data ? data.user : null;
  }

  async findByEmailAndPassword(
    email: Email,
    password: string
  ): Promise<User | null> {
    const data = demoUsers.get(email.getValue());

    if (!data) {
      return null;
    }

    // In production, compare hashed passwords
    if (data.password === password) {
      return data.user;
    }

    return null;
  }

  async save(user: User): Promise<void> {
    // For demo purposes, we don't actually save
    // In production, this would persist to a database
    console.log('User saved:', user);
  }
}
