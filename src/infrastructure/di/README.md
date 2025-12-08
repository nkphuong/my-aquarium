# Dependency Injection with TSyringe

This project uses [TSyringe](https://github.com/microsoft/tsyringe) for dependency injection, following clean architecture principles.

## Overview

TSyringe is a lightweight dependency injection container for TypeScript/JavaScript, maintained by Microsoft.

### Why Dependency Injection?

- **Loose Coupling**: Classes don't create their dependencies, they receive them
- **Testability**: Easy to mock dependencies in tests
- **Flexibility**: Swap implementations without changing business logic
- **Clean Architecture**: Maintains proper dependency direction (Infrastructure → Application → Domain)

## Configuration

### TypeScript Setup

The following is configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Container Setup

All dependencies are registered in [`container.ts`](./container.ts):

```typescript
import { getContainer, DI_TOKENS } from '@/infrastructure/di'

// Get the configured container
const container = getContainer()

// Resolve a dependency
const loginUseCase = container.resolve<LoginUseCase>(DI_TOKENS.LoginUseCase)
```

## Available Tokens

Defined in `DI_TOKENS`:

- `UserRepository` - User data access interface
- `LoginUseCase` - User login business logic

## Usage Examples

### 1. Using DI in Server Actions

```typescript
// app/actions/some-action.ts
import { getContainer, DI_TOKENS } from '@/infrastructure/di'
import { SomeUseCase } from '@/application/use-cases/some.use-case'

export async function someAction() {
  const container = getContainer()
  const useCase = container.resolve<SomeUseCase>(DI_TOKENS.SomeUseCase)

  const result = await useCase.execute({ /* data */ })
  return result
}
```

### 2. Using DI in API Routes

```typescript
// app/api/some-route/route.ts
import { getContainer, DI_TOKENS } from '@/infrastructure/di'
import { SomeUseCase } from '@/application/use-cases/some.use-case'

export async function POST(request: Request) {
  const container = getContainer()
  const useCase = container.resolve<SomeUseCase>(DI_TOKENS.SomeUseCase)

  const data = await request.json()
  const result = await useCase.execute(data)

  return Response.json(result)
}
```

### 3. Environment-Based Configuration

The container automatically selects the appropriate repository implementation:

```bash
# .env.local
NEXT_PUBLIC_USE_IN_MEMORY=true  # Use in-memory repository (for testing)
# Or omit/set to false to use NestJS API repository
```

## Adding New Dependencies

### Step 1: Add Token

Edit `container.ts` and add your token:

```typescript
export const DI_TOKENS = {
  UserRepository: Symbol.for('UserRepository'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  // Add your new token
  TankRepository: Symbol.for('TankRepository'),
  CreateTankUseCase: Symbol.for('CreateTankUseCase'),
} as const
```

### Step 2: Register Dependency

In the `configureDependencies()` function:

```typescript
// For a singleton (one instance shared everywhere)
container.registerSingleton<TankRepository>(
  DI_TOKENS.TankRepository,
  NestJSTankRepository
)

// For a factory with dependencies
container.register<CreateTankUseCase>(
  DI_TOKENS.CreateTankUseCase,
  {
    useFactory: (c) => {
      const tankRepo = c.resolve<TankRepository>(DI_TOKENS.TankRepository)
      const userRepo = c.resolve<UserRepository>(DI_TOKENS.UserRepository)
      return new CreateTankUseCase(tankRepo, userRepo)
    },
  }
)
```

### Step 3: Use It

```typescript
import { getContainer, DI_TOKENS } from '@/infrastructure/di'

const container = getContainer()
const useCase = container.resolve<CreateTankUseCase>(DI_TOKENS.CreateTankUseCase)
```

## Best Practices

### ✅ DO

- Register all dependencies in `container.ts` (composition root)
- Use tokens from `DI_TOKENS` for type safety
- Resolve dependencies at the entry point (server actions, API routes)
- Keep domain and application layers independent of the DI framework

### ❌ DON'T

- Don't use `@injectable()` decorators on domain/application classes
- Don't resolve dependencies inside domain entities or value objects
- Don't create multiple container instances
- Don't manually instantiate classes that should be injected

## Architecture Compliance

This DI setup maintains clean architecture:

```
Domain Layer (No DI awareness)
    ↑
Application Layer (No DI awareness)
    ↑
Infrastructure Layer (DI Configuration)
    ↑
Presentation Layer (DI Resolution)
```

- **Domain & Application**: Pure TypeScript, no TSyringe imports
- **Infrastructure**: Configures the container
- **Presentation** (App Router): Resolves dependencies

## Testing

For tests, you can create a test container:

```typescript
import { container } from 'tsyringe'
import { DI_TOKENS } from '@/infrastructure/di'

// In your test setup
beforeEach(() => {
  container.clearInstances()

  // Register mock implementations
  container.registerInstance(
    DI_TOKENS.UserRepository,
    mockUserRepository
  )
})
```

## Resources

- [TSyringe Documentation](https://github.com/microsoft/tsyringe)
- [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Dependency Injection Principles](https://en.wikipedia.org/wiki/Dependency_injection)
