# Feature Implementation Template

Use this checklist when implementing a new feature following DDD/Hexagonal Architecture.

## Feature: [Feature Name]

### 1. Domain Layer

- [ ] **Entity** - `src/domain/entities/[name].entity.ts`
  - Define core business object with identity
  - Add business logic methods
  - Include validation rules

- [ ] **Value Objects** - `src/domain/value-objects/[name].ts`
  - Create immutable objects for typed values
  - Add validation logic
  - Implement equality methods

- [ ] **Repository Interface** - `src/domain/repositories/[name].repository.ts`
  - Define data access contract
  - Keep it simple (CRUD operations)

- [ ] **Domain Service** (if needed) - `src/domain/services/[name].service.ts`
  - For business logic that doesn't fit in entities
  - Operates on multiple entities

### 2. Application Layer

- [ ] **Use Cases** - `src/application/use-cases/[action]-[entity].use-case.ts`
  - One file per user action (create, update, delete, get, etc.)
  - Orchestrate domain objects
  - Handle business flow

- [ ] **DTOs** - `src/application/dtos/[name].dto.ts`
  - Input/output data structures
  - Simple, serializable objects

- [ ] **Ports** (if needed) - `src/application/ports/[name].port.ts`
  - Interfaces for external services
  - Email, payment, notifications, etc.

### 3. Infrastructure Layer

- [ ] **Repository Implementation** - `src/infrastructure/persistence/[db]-[name].repository.ts`
  - Implement domain repository interface
  - Handle data mapping (DB ↔ Domain)
  - Use ORM/database client

- [ ] **External Service Client** (if needed) - `src/infrastructure/external-services/[name].client.ts`
  - Implement application ports
  - Third-party API integration

- [ ] **Adapters** (if needed) - `src/infrastructure/adapters/[name].adapter.ts`
  - Convert between formats
  - Map external data to domain objects

### 4. Presentation Layer

- [ ] **Server Actions** - `src/app/actions/[entity]-actions.ts`
  - Wire up use cases
  - Handle dependency injection
  - Error handling and formatting

- [ ] **Page Components** - `src/app/[route]/page.tsx`
  - Next.js route pages
  - Server components by default

- [ ] **Feature Components** - `src/presentation/components/features/[name].tsx`
  - Reusable feature components
  - Call server actions
  - Handle UI state

- [ ] **UI Components** (if needed) - `src/presentation/components/ui/[name].tsx`
  - Use shadcn/ui for primitives
  - Custom UI elements if needed

- [ ] **Hooks** (if needed) - `src/presentation/hooks/use-[name].ts`
  - Custom React hooks
  - Client-side logic

### 5. Testing

- [ ] **Domain Tests** - `__tests__/domain/[name].test.ts`
  - Test entities, value objects
  - Pure unit tests

- [ ] **Application Tests** - `__tests__/application/[name].test.ts`
  - Test use cases with mocked repositories
  - Test business flows

- [ ] **Infrastructure Tests** - `__tests__/infrastructure/[name].test.ts`
  - Integration tests with real DB
  - Test repository implementations

- [ ] **Component Tests** - `__tests__/presentation/[name].test.tsx`
  - Test React components
  - Mock server actions

## Example: User Management Feature

### Files Created

```
src/domain/
├── entities/
│   └── user.entity.ts
├── value-objects/
│   └── email.ts
└── repositories/
    └── user.repository.ts

src/application/
├── use-cases/
│   ├── create-user.use-case.ts
│   ├── get-user.use-case.ts
│   └── update-user.use-case.ts
└── dtos/
    └── user.dto.ts

src/infrastructure/
└── persistence/
    └── prisma-user.repository.ts

src/presentation/
├── components/
│   └── features/
│       ├── create-user-form.tsx
│       └── user-list.tsx
└── hooks/
    └── use-user.ts

src/app/
├── users/
│   ├── page.tsx
│   └── new/
│       └── page.tsx
└── actions/
    └── user-actions.ts
```

## Quick Checklist

Before considering a feature complete:

- [ ] All layers have appropriate files
- [ ] Dependencies flow inward (Presentation → App → Domain ← Infrastructure)
- [ ] Domain layer has no framework dependencies
- [ ] Interfaces are defined in domain/application, implemented in infrastructure
- [ ] TypeScript path aliases are used (`@/domain/*`, etc.)
- [ ] Tests are written for critical paths
- [ ] Error handling is implemented at each layer
- [ ] Build passes (`pnpm build`)
- [ ] Linting passes (`pnpm lint`)
