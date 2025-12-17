# Dependency Injection - NestJS/Laravel Style! 🚀

This project uses **auto-resolving DI** similar to NestJS and Laravel - clean, simple, and type-safe!

## Quick Start

### Using Services (1 Line!)

```typescript
import { getService } from '@/infrastructure/di'

// ✨ That's it! Auto-resolves with full type safety
const authService = getService('AuthService')
await authService.login({ email, password })
```

### Complete Example - Server Action

```typescript
'use server'

import { getService } from '@/infrastructure/di'

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // ✨ One line - auto-resolves all dependencies!
  const authService = getService('AuthService')

  const result = await authService.login({ email, password })
  return result
}
```

**Compare to old approach:**
```typescript
// ❌ Old way (verbose)
const container = getContainer()
const authService = container.resolve<AuthService>(DI_TOKENS.AuthService)

// ✅ New way (clean!)
const authService = getService('AuthService')
```

## How It Works

### 1. Services Are Auto-Registered

All services in `container.ts` are automatically available:

```typescript
// src/infrastructure/di/container.ts
export const DI_TOKENS = {
  UserRepository: Symbol.for('UserRepository'),
  AuthService: Symbol.for('AuthService'),
}

export type ServiceMap = {
  UserRepository: UserRepository
  AuthService: AuthService
}
```

### 2. getService() Is Type-Safe

TypeScript knows exactly what type each service is:

```typescript
const authService = getService('AuthService')
// TypeScript knows: authService is AuthService ✅

const userRepo = getService('UserRepository')
// TypeScript knows: userRepo is UserRepository ✅

// @ts-expect-error - TypeScript prevents typos!
const wrong = getService('WrongService')
```

### 3. Dependencies Auto-Resolve

Services automatically get their dependencies:

```typescript
// AuthService needs UserRepository
class AuthService {
  constructor(private userRepository: UserRepository) {}
}

// When you call getService('AuthService'):
// 1. Container sees AuthService needs UserRepository
// 2. Container resolves UserRepository first
// 3. Container creates AuthService with UserRepository
// 4. You get fully configured AuthService ✨
```

## Common Use Cases

### Server Actions

```typescript
'use server'

import { getService } from '@/infrastructure/di'

export async function createUser(data: CreateUserInput) {
  const userService = getService('UserService')
  return await userService.createUser(data)
}
```

### API Routes

```typescript
import { getService } from '@/infrastructure/di'

export async function POST(request: Request) {
  const authService = getService('AuthService')

  const data = await request.json()
  const result = await authService.login(data)

  return Response.json(result)
}
```

### Middleware/Auth

```typescript
import { getService } from '@/infrastructure/di'

export async function middleware(request: NextRequest) {
  const authService = getService('AuthService')
  // Use service...
}
```

## Adding New Services

### Step 1: Create Your Service

```typescript
// src/application/services/tank.service.ts
export class TankService {
  constructor(
    private readonly tankRepository: TankRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createTank(userId: string, name: string) {
    // Business logic...
  }
}
```

### Step 2: Register in Container

```typescript
// src/infrastructure/di/container.ts

// 1. Add token
export const DI_TOKENS = {
  UserRepository: Symbol.for('UserRepository'),
  AuthService: Symbol.for('AuthService'),
  TankRepository: Symbol.for('TankRepository'),  // Add this
  TankService: Symbol.for('TankService'),        // Add this
} as const

// 2. Add to type map
export type ServiceMap = {
  UserRepository: UserRepository
  AuthService: AuthService
  TankRepository: TankRepository  // Add this
  TankService: TankService        // Add this
}

// 3. Register in configureDependencies()
export function configureDependencies(): void {
  // ... existing registrations ...

  // Register repository
  container.registerSingleton<TankRepository>(
    DI_TOKENS.TankRepository,
    InMemoryTankRepository
  )

  // Register service with dependencies
  container.register<TankService>(
    DI_TOKENS.TankService,
    {
      useFactory: (c) => {
        const tankRepo = c.resolve<TankRepository>(DI_TOKENS.TankRepository)
        const userRepo = c.resolve<UserRepository>(DI_TOKENS.UserRepository)
        return new TankService(tankRepo, userRepo)
      },
    }
  )
}
```

### Step 3: Use It!

```typescript
const tankService = getService('TankService')
await tankService.createTank(userId, 'My Aquarium')
```

## Advanced Features

### Environment-Based Configuration

```typescript
// Automatically switches between implementations
const useInMemory = process.env.NEXT_PUBLIC_USE_IN_MEMORY === 'true'

if (useInMemory) {
  container.registerSingleton<UserRepository>(
    DI_TOKENS.UserRepository,
    InMemoryUserRepository  // Dev/test
  )
} else {
  container.registerSingleton<UserRepository>(
    DI_TOKENS.UserRepository,
    NestJSUserRepository    // Production
  )
}
```

### Alternative: Direct Class Resolution

For advanced cases, you can resolve classes directly:

```typescript
import { resolve } from '@/infrastructure/di'
import { AuthService } from '@/application/services/auth.service'

const authService = resolve(AuthService)
```

## Testing

Mock services easily:

```typescript
import { container } from 'tsyringe'
import { DI_TOKENS } from '@/infrastructure/di'

beforeEach(() => {
  container.clearInstances()

  // Register mock
  container.registerInstance(
    DI_TOKENS.AuthService,
    mockAuthService
  )
})

test('login action', async () => {
  // getService() will return your mock!
  const result = await loginAction(formData)
  expect(result.success).toBe(true)
})
```

## Architecture Compliance

✅ **Clean Architecture maintained:**
- Domain/Application layers: No DI imports
- Infrastructure layer: Configures container
- Presentation layer: Uses `getService()`

```
Presentation (app/)
    ↓ uses getService()
Infrastructure (DI config)
    ↓ provides
Application (Services)
    ↓ depends on
Domain (Entities, Repositories)
```

## Best Practices

### ✅ DO

- Use `getService()` for clean, readable code
- Add all services to `ServiceMap` for type safety
- Resolve at entry points (server actions, API routes)
- Use environment variables for configuration

### ❌ DON'T

- Don't call `getService()` inside domain entities
- Don't create multiple container instances
- Don't manually instantiate services (use DI!)
- Don't forget to add new services to `ServiceMap`

## Why This Approach?

### Benefits over Raw TSyringe

1. **Less Verbose**: `getService('AuthService')` vs `container.resolve<AuthService>(DI_TOKENS.AuthService)`
2. **Type Safe**: TypeScript autocomplete for service names
3. **Prevents Typos**: `getService('WrongName')` = TypeScript error
4. **Familiar**: Same style as NestJS/Laravel developers know
5. **Easier to Learn**: New developers pick it up instantly

### Similar to NestJS

```typescript
// NestJS
constructor(private authService: AuthService) {}

// Our approach
const authService = getService('AuthService')
```

Both:
- ✅ Auto-resolve dependencies
- ✅ Type safe
- ✅ Clean and simple
- ✅ Easy to test

## Resources

- [TSyringe Docs](https://github.com/microsoft/tsyringe)
- [Dependency Injection Principles](https://en.wikipedia.org/wiki/Dependency_injection)
- [NestJS DI](https://docs.nestjs.com/providers) (for comparison)
