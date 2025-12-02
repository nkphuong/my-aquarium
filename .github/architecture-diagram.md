# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
│                  (src/app/ & src/presentation/)                 │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  Next.js App │  │   React      │  │  Server Actions   │   │
│  │    Router    │  │  Components  │  │   (Wire-up)       │   │
│  │   (Pages)    │  │  & Hooks     │  │                   │   │
│  └──────────────┘  └──────────────┘  └───────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               ↓
                    Calls Use Cases
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│                      (src/application/)                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  Use Cases   │  │     DTOs     │  │   Ports (I/O)     │   │
│  │ (Interactors)│  │              │  │  (Interfaces)     │   │
│  └──────────────┘  └──────────────┘  └───────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               ↓
                  Uses Domain Entities & Repos
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                        DOMAIN LAYER                             │
│                       (src/domain/)                             │
│                      ★ Core Business Logic ★                    │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │   Entities   │  │    Value     │  │   Repository      │   │
│  │ (User, etc.) │  │   Objects    │  │   Interfaces      │   │
│  │              │  │ (Email, etc.)│  │                   │   │
│  └──────────────┘  └──────────────┘  └───────────────────┘   │
│                                                                 │
│  ┌──────────────┐                                              │
│  │   Domain     │                                              │
│  │   Services   │                                              │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               ↑
                      Implements Interfaces
                               ↑
┌─────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                         │
│                    (src/infrastructure/)                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ Repositories │  │   External   │  │    Adapters       │   │
│  │(Prisma, DB)  │  │   Services   │  │  (Converters)     │   │
│  │              │  │ (APIs, etc.) │  │                   │   │
│  └──────────────┘  └──────────────┘  └───────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Dependency Flow

```
Presentation Layer
       ↓ (depends on)
Application Layer
       ↓ (depends on)
  Domain Layer
       ↑ (implements interfaces)
Infrastructure Layer
```

## Example Data Flow: Create User

```
1. User fills form in UI
   └─→ src/presentation/components/features/create-user-form.tsx

2. Form submits to Server Action
   └─→ src/app/actions/user-actions.ts
       ├─→ Creates repository instance (DI)
       └─→ Creates use case instance (DI)

3. Use Case orchestrates business logic
   └─→ src/application/use-cases/create-user.use-case.ts
       ├─→ Creates domain entities
       │   └─→ src/domain/entities/user.entity.ts
       ├─→ Uses value objects
       │   └─→ src/domain/value-objects/email.ts
       └─→ Calls repository interface
           └─→ src/domain/repositories/user.repository.ts

4. Repository implementation persists data
   └─→ src/infrastructure/persistence/prisma-user.repository.ts
       └─→ Saves to database via Prisma

5. Success/failure returned back up the chain
   └─→ UI updates with result
```

## Key Benefits

- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Flexibility**: Easy to swap implementations (e.g., change database)
- **Clear Boundaries**: Each layer has a single responsibility
- **Business Logic Protection**: Domain layer is pure, no framework coupling
