# Architecture Guide

This document provides detailed guidance on implementing features using Clean Architecture in this project.

## Quick Reference

### Where to Put New Code

| Type of Code | Location | Example |
|-------------|----------|---------|
| Business entities | `src/domain/entities/` | User, Product, Order |
| Repository interfaces | `src/domain/repositories/` | UserRepository interface |
| Application services | `src/application/services/` | AuthService, ProductService |
| DTOs | `src/application/dtos/` | CreateUserDTO, ProductDTO |
| Service interfaces | `src/application/` or `src/domain/` | EmailService, PaymentGateway |
| Repository implementations | `src/infrastructure/persistence/` | PrismaUserRepository |
| External service clients | `src/infrastructure/external-services/` | StripeClient, SendgridClient |
| React components | `src/presentation/components/` | Header, ProductCard |
| UI primitives | `src/presentation/components/ui/` | Button, Input (shadcn/ui) |
| Custom hooks | `src/presentation/hooks/` | useAuth, useProducts |
| Next.js pages | `app/` | page.tsx, layout.tsx |
| Server Actions | `app/actions/` | user-actions.ts |

## Implementation Flow

### Adding a New Feature (Example: User Management)

#### 1. Start with the Domain Layer

**Create Entity** (`src/domain/entities/user.entity.ts`):
```typescript
export class User {
  constructor(
    public readonly id: string,
    private _email: string,
    private _name: string
  ) {
    this.validate();
  }

  get email(): string {
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

  private validate(): void {
    if (!this._email || !this._email.trim()) {
      throw new Error('Email cannot be empty');
    }
    if (!this._name || !this._name.trim()) {
      throw new Error('Name cannot be empty');
    }
  }
}
```

**Define Repository Interface** (`src/domain/repositories/user.repository.ts`):
```typescript
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

#### 2. Application Layer

**Create Service** (`src/application/services/user.service.ts`):
```typescript
import { User } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';

export interface CreateUserDTO {
  email: string;
  name: string;
}

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Create a new user
   */
  async createUser(dto: CreateUserDTO): Promise<User> {
    // Validate email format
    if (!this.isValidEmail(dto.email)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create and save new user
    const user = new User(crypto.randomUUID(), dto.email, dto.name);
    await this.userRepository.save(user);

    return user;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

#### 3. Infrastructure Layer

**Implement Repository** (`src/infrastructure/persistence/prisma-user.repository.ts`):
```typescript
import { User } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';
// import { prisma } from './prisma-client';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    // const userData = await prisma.user.findUnique({ where: { id } });
    // if (!userData) return null;
    // return this.toDomain(userData);
    throw new Error('Not implemented');
  }

  async findByEmail(email: string): Promise<User | null> {
    // const userData = await prisma.user.findUnique({
    //   where: { email }
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
    //     email: user.email,
    //     name: user.name,
    //   },
    //   update: {
    //     name: user.name,
    //   },
    // });
  }

  private toDomain(data: any): User {
    return new User(data.id, data.email, data.name);
  }
}
```

#### 4. Presentation Layer

**Create Server Action** (`app/actions/user-actions.ts`):
```typescript
'use server'

import { UserService } from '@/application/services/user.service';
import { getContainer, DI_TOKENS } from '@/infrastructure/di';

export async function createUser(formData: FormData) {
  // Use dependency injection to get the service
  const container = getContainer();
  const userService = container.resolve<UserService>(DI_TOKENS.UserService);

  try {
    const user = await userService.createUser({
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

**Use in Page** (`app/users/new/page.tsx`):
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

### 2. Entities
- **Entity**: Has a unique identity and contains business logic (e.g., User with ID)
- Entities should validate their own state in the constructor

### 3. Repository Pattern
- Interfaces in `domain/repositories/`
- Implementations in `infrastructure/persistence/`
- Abstracts data storage from domain logic

### 4. Application Services
- Services are classes that can contain multiple related methods
- Each method represents a business operation (e.g., createUser, getUserById)
- Orchestrates entities, repositories, and domain services
- Returns domain objects or DTOs, never infrastructure types

### 5. Server Actions (Next.js)
- Wire up services in server actions
- Use dependency injection to resolve services
- Convert between DTOs and Next.js types

## Testing Strategy

- **Domain Layer**: Pure unit tests (no mocks needed)
- **Application Layer**: Test with repository mocks
- **Infrastructure**: Integration tests with real databases
- **Presentation**: Component tests with mocked server actions

## Common Patterns

### Dependency Injection
This project uses TSyringe for dependency injection. All services are registered in the DI container:

```typescript
// src/infrastructure/di/container.ts
import { container } from 'tsyringe';
import { UserService } from '@/application/services/user.service';
import { UserRepository } from '@/domain/repositories/user.repository';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma-user.repository';

export const DI_TOKENS = {
  UserRepository: Symbol.for('UserRepository'),
  UserService: Symbol.for('UserService'),
} as const;

container.registerSingleton<UserRepository>(
  DI_TOKENS.UserRepository,
  PrismaUserRepository
);

container.register<UserService>(
  DI_TOKENS.UserService,
  {
    useFactory: (c) => {
      const userRepo = c.resolve<UserRepository>(DI_TOKENS.UserRepository);
      return new UserService(userRepo);
    },
  }
);
```

### Error Handling
- Domain: Throw descriptive errors for rule violations
- Application: Catch domain errors, add context
- Presentation: Display user-friendly messages

### Entities as Plain Interfaces (Hybrid Approach)

This project uses **Option 3 - Hybrid Approach**:

**Entities are plain TypeScript interfaces:**
```typescript
// ✅ Simple, serializable
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
```

**Benefits:**
- ✅ Works seamlessly with Next.js Server Actions (serializable)
- ✅ No conversion needed between layers
- ✅ Less boilerplate
- ✅ Easy to work with in React components

**Business logic lives in services:**
```typescript
export class UserService {
  async createUser(email: string, name: string): Promise<User> {
    // Validation here
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date()
    };

    await this.userRepository.save(user);
    return user; // ✅ Already serializable!
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### When to Use DTOs

DTOs are **optional** and only needed when:

1. **Hiding sensitive fields:**
```typescript
// Service method to get public profile
toPublicProfile(user: User) {
  return {
    id: user.id,
    name: user.name,
    // email hidden for privacy
  };
}
```

2. **Transforming data for API:**
```typescript
// Convert Date objects to ISO strings
toDTO(user: User) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString()
  };
}
```

3. **Aggregating data:**
```typescript
async getUserWithStats(userId: string) {
  const user = await this.userRepository.findById(userId);
  const postCount = await this.postRepository.countByUser(userId);

  return {
    ...user,
    postCount // Added field
  };
}
```

**For simple cases, return entities directly** - no DTO needed!
