# Dependency Injection - Complete Example

This example shows how to add a new feature using dependency injection, from domain to presentation.

## Example: Tank Management Feature

### Step 1: Domain Layer (No DI awareness)

```typescript
// src/domain/entities/tank.entity.ts
export class Tank {
  constructor(
    public readonly id: string,
    private _name: string,
    private _capacity: number
  ) {}

  get name(): string {
    return this._name
  }

  get capacity(): number {
    return this._capacity
  }
}

// src/domain/repositories/tank.repository.ts
export interface TankRepository {
  findById(id: string): Promise<Tank | null>
  findAll(): Promise<Tank[]>
  save(tank: Tank): Promise<void>
  delete(id: string): Promise<void>
}
```

### Step 2: Application Layer (No DI awareness)

```typescript
// src/application/use-cases/create-tank.use-case.ts
import { Tank } from '@/domain/entities/tank.entity'
import { TankRepository } from '@/domain/repositories/tank.repository'

export interface CreateTankDTO {
  name: string
  capacity: number
}

export class CreateTankUseCase {
  constructor(private readonly tankRepository: TankRepository) {}

  async execute(dto: CreateTankDTO): Promise<Tank> {
    const tank = new Tank(
      crypto.randomUUID(),
      dto.name,
      dto.capacity
    )

    await this.tankRepository.save(tank)
    return tank
  }
}
```

### Step 3: Infrastructure Layer (Repository Implementation)

```typescript
// src/infrastructure/persistence/nestjs-tank.repository.ts
import { Tank } from '@/domain/entities/tank.entity'
import { TankRepository } from '@/domain/repositories/tank.repository'

export class NestJSTankRepository implements TankRepository {
  private readonly apiUrl = process.env.NEXT_PUBLIC_API_URL

  async findById(id: string): Promise<Tank | null> {
    const response = await fetch(`${this.apiUrl}/tanks/${id}`)
    if (!response.ok) return null

    const data = await response.json()
    return new Tank(data.id, data.name, data.capacity)
  }

  async findAll(): Promise<Tank[]> {
    const response = await fetch(`${this.apiUrl}/tanks`)
    const data = await response.json()

    return data.map((item: any) =>
      new Tank(item.id, item.name, item.capacity)
    )
  }

  async save(tank: Tank): Promise<void> {
    await fetch(`${this.apiUrl}/tanks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: tank.id,
        name: tank.name,
        capacity: tank.capacity,
      }),
    })
  }

  async delete(id: string): Promise<void> {
    await fetch(`${this.apiUrl}/tanks/${id}`, {
      method: 'DELETE',
    })
  }
}
```

### Step 4: Register in DI Container

```typescript
// src/infrastructure/di/container.ts
import { TankRepository } from '@/domain/repositories/tank.repository'
import { CreateTankUseCase } from '@/application/use-cases/create-tank.use-case'
import { NestJSTankRepository } from '@/infrastructure/persistence/nestjs-tank.repository'

// Add to tokens
export const DI_TOKENS = {
  UserRepository: Symbol.for('UserRepository'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  // Add new tokens
  TankRepository: Symbol.for('TankRepository'),
  CreateTankUseCase: Symbol.for('CreateTankUseCase'),
} as const

// In configureDependencies() function, add:
export function configureDependencies(): void {
  // ... existing registrations ...

  // Register Tank Repository
  container.registerSingleton<TankRepository>(
    DI_TOKENS.TankRepository,
    NestJSTankRepository
  )

  // Register Create Tank Use Case
  container.register<CreateTankUseCase>(
    DI_TOKENS.CreateTankUseCase,
    {
      useFactory: (c) => {
        const tankRepo = c.resolve<TankRepository>(DI_TOKENS.TankRepository)
        return new CreateTankUseCase(tankRepo)
      },
    }
  )
}
```

### Step 5: Use in Server Action

```typescript
// app/actions/tank-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getContainer, DI_TOKENS } from '@/infrastructure/di'
import { CreateTankUseCase } from '@/application/use-cases/create-tank.use-case'

export async function createTankAction(formData: FormData) {
  const name = formData.get('name') as string
  const capacity = Number(formData.get('capacity'))

  try {
    // Resolve use case from DI container
    const container = getContainer()
    const createTankUseCase = container.resolve<CreateTankUseCase>(
      DI_TOKENS.CreateTankUseCase
    )

    const tank = await createTankUseCase.execute({ name, capacity })

    revalidatePath('/tanks')

    return {
      success: true,
      tank: {
        id: tank.id,
        name: tank.name,
        capacity: tank.capacity,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tank',
    }
  }
}
```

### Step 6: Use in Component

```typescript
// components/features/create-tank-form.tsx
'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTankAction } from '@/app/actions/tank-actions'

export function CreateTankForm() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(createTankAction, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name">Tank Name</label>
        <Input
          id="name"
          name="name"
          type="text"
          required
        />
      </div>

      <div>
        <label htmlFor="capacity">Capacity (liters)</label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          required
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create Tank'}
      </Button>

      {state?.success && (
        <p className="text-green-600">Tank created successfully!</p>
      )}

      {state?.error && (
        <p className="text-red-600">{state.error}</p>
      )}
    </form>
  )
}
```

## Key Takeaways

1. **Domain & Application layers** have NO knowledge of DI
   - They just define interfaces and classes with constructor injection
   - Pure TypeScript, fully testable

2. **Infrastructure layer** configures the DI container
   - Implements repository interfaces
   - Registers all dependencies

3. **Presentation layer** (app/) resolves dependencies
   - Server Actions call `getContainer().resolve()`
   - Components use Server Actions

4. **Benefits**:
   - Easy to swap implementations (e.g., mock for testing)
   - Clear dependency flow
   - Testable at every layer
   - Type-safe resolution

## Testing Example

```typescript
// __tests__/create-tank.test.ts
import { container } from 'tsyringe'
import { DI_TOKENS } from '@/infrastructure/di'
import { CreateTankUseCase } from '@/application/use-cases/create-tank.use-case'
import { TankRepository } from '@/domain/repositories/tank.repository'

describe('CreateTankUseCase', () => {
  let mockTankRepository: jest.Mocked<TankRepository>

  beforeEach(() => {
    container.clearInstances()

    // Create mock repository
    mockTankRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    }

    // Register mock
    container.registerInstance(
      DI_TOKENS.TankRepository,
      mockTankRepository
    )

    // Register use case with mock dependency
    container.register(
      DI_TOKENS.CreateTankUseCase,
      {
        useFactory: (c) => {
          const repo = c.resolve<TankRepository>(DI_TOKENS.TankRepository)
          return new CreateTankUseCase(repo)
        },
      }
    )
  })

  it('should create a tank', async () => {
    const useCase = container.resolve<CreateTankUseCase>(
      DI_TOKENS.CreateTankUseCase
    )

    const result = await useCase.execute({
      name: 'Test Tank',
      capacity: 100,
    })

    expect(result.name).toBe('Test Tank')
    expect(result.capacity).toBe(100)
    expect(mockTankRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Tank',
        capacity: 100,
      })
    )
  })
})
```
