# Architecture Guide

This document provides detailed guidance on implementing features using the DDD/Hexagonal Architecture in this project.

## Quick Reference

### Where to Put New Code

| Type of Code | Location | Example |
|-------------|----------|---------|
| Business entities | `src/domain/entities/` | User, Product, Order |
| Value objects | `src/domain/value-objects/` | Email, Money, Address |
| Repository interfaces | `src/domain/repositories/` | UserRepository interface |
| Use cases | `src/application/use-cases/` | CreateUser, GetProducts |
| DTOs | `src/application/dtos/` | CreateUserDTO, ProductDTO |
| Service interfaces | `src/application/ports/` | EmailService, PaymentGateway |
| Repository implementations | `src/infrastructure/persistence/` | PrismaUserRepository |
| External service clients | `src/infrastructure/external-services/` | StripeClient, SendgridClient |
| React components | `src/presentation/components/` | Header, ProductCard |
| UI primitives | `src/presentation/components/ui/` | Button, Input (shadcn/ui) |
| Custom hooks | `src/presentation/hooks/` | useAuth, useProducts |
| Next.js pages | `src/app/` | page.tsx, layout.tsx |

## Implementation Flow

### Adding a New Feature (Example: User Management)

#### 1. Start with the Domain Layer

**Create Entity** (`src/domain/entities/user.entity.ts`):
```typescript
export class User {
  constructor(
    public readonly id: string,
    private _email: Email,
    private _name: string
  ) {}

  get email(): Email {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  updateName(newName: string): void {
    if (!newName.trim()) {
      throw new Error('Name cannot be empty');
    }
    this._name = newName;
  }
}
```

**Create Value Object** (`src/domain/value-objects/email.ts`):
```typescript
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('Invalid email');
    }
    this.value = email.toLowerCase();
  }

  getValue(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

**Define Repository Interface** (`src/domain/repositories/user.repository.ts`):
```typescript
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

#### 2. Application Layer

**Create Use Case** (`src/application/use-cases/create-user.use-case.ts`):
```typescript
import { User } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email';
import { UserRepository } from '@/domain/repositories/user.repository';

export interface CreateUserDTO {
  email: string;
  name: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    const email = new Email(dto.email);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create and save new user
    const user = new User(crypto.randomUUID(), email, dto.name);
    await this.userRepository.save(user);

    return user;
  }
}
```

#### 3. Infrastructure Layer

**Implement Repository** (`src/infrastructure/persistence/prisma-user.repository.ts`):
```typescript
import { User } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email';
import { UserRepository } from '@/domain/repositories/user.repository';
// import { prisma } from './prisma-client';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    // const userData = await prisma.user.findUnique({ where: { id } });
    // if (!userData) return null;
    // return this.toDomain(userData);
    throw new Error('Not implemented');
  }

  async findByEmail(email: Email): Promise<User | null> {
    // const userData = await prisma.user.findUnique({
    //   where: { email: email.getValue() }
    // });
    // if (!userData) return null;
    // return this.toDomain(userData);
    throw new Error('Not implemented');
  }

  async save(user: User): Promise<void> {
    // await prisma.user.upsert({
    //   where: { id: user.id },
    //   create: {
    //     id: user.id,
    //     email: user.email.getValue(),
    //     name: user.name,
    //   },
    //   update: {
    //     name: user.name,
    //   },
    // });
  }

  private toDomain(data: any): User {
    return new User(data.id, new Email(data.email), data.name);
  }
}
```

#### 4. Presentation Layer

**Create Server Action** (`src/app/actions/user-actions.ts`):
```typescript
'use server'

import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma-user.repository';

export async function createUser(formData: FormData) {
  const repository = new PrismaUserRepository();
  const useCase = new CreateUserUseCase(repository);

  try {
    const user = await useCase.execute({
      email: formData.get('email') as string,
      name: formData.get('name') as string,
    });

    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

**Create Component** (`src/presentation/components/features/create-user-form.tsx`):
```typescript
'use client'

import { Button } from '@/presentation/components/ui/button';
import { createUser } from '@/app/actions/user-actions';

export function CreateUserForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createUser(formData);
    if (result.success) {
      alert('User created!');
    } else {
      alert(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" required />
      <input name="name" type="text" required />
      <Button type="submit">Create User</Button>
    </form>
  );
}
```

**Use in Page** (`src/app/users/new/page.tsx`):
```typescript
import { CreateUserForm } from '@/presentation/components/features/create-user-form';

export default function NewUserPage() {
  return (
    <div>
      <h1>Create New User</h1>
      <CreateUserForm />
    </div>
  );
}
```

## Key Principles

### 1. Dependency Rule
- Dependencies point inward: Presentation → Application → Domain
- Infrastructure implements interfaces from Domain/Application
- Domain layer has no dependencies on other layers

### 2. Entity vs Value Object
- **Entity**: Has a unique identity (e.g., User with ID)
- **Value Object**: Defined by attributes (e.g., Email, Money)

### 3. Repository Pattern
- Interfaces in `domain/repositories/`
- Implementations in `infrastructure/persistence/`
- Abstracts data storage from domain logic

### 4. Use Cases
- One use case = one user action
- Orchestrates entities, repositories, and services
- Returns domain objects or DTOs, never infrastructure types

### 5. Server Actions (Next.js)
- Wire up use cases in server actions
- Handle dependency injection
- Convert between DTOs and Next.js types

## Testing Strategy

- **Domain Layer**: Pure unit tests (no mocks needed)
- **Application Layer**: Test with repository mocks
- **Infrastructure**: Integration tests with real databases
- **Presentation**: Component tests with mocked server actions

## Common Patterns

### Dependency Injection
Use factory functions or dependency injection containers to wire up dependencies:

```typescript
// src/infrastructure/di/container.ts
export function createUserRepository(): UserRepository {
  return new PrismaUserRepository();
}

export function createCreateUserUseCase(): CreateUserUseCase {
  return new CreateUserUseCase(createUserRepository());
}
```

### Error Handling
- Domain: Throw descriptive errors for rule violations
- Application: Catch domain errors, add context
- Presentation: Display user-friendly messages

### DTOs vs Entities
- Use entities within domain and application layers
- Convert to DTOs at presentation layer boundaries
- DTOs are simple, serializable objects for transport
