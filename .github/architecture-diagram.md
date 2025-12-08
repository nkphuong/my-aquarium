# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRAMEWORK LAYER                      │
│                           (app/)                                │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  Next.js App │  │   Layouts    │  │  Server Actions   │   │
│  │    Router    │  │   & Pages    │  │   (Wire-up)       │   │
│  │   (Pages)    │  │              │  │                   │   │
│  └──────────────┘  └──────────────┘  └───────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               ↓
                    Uses Presentation Components
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│                    (src/presentation/)                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │   React      │  │  shadcn/ui   │  │  Custom Hooks     │   │
│  │  Components  │  │  Components  │  │                   │   │
│  │  (Features)  │  │              │  │                   │   │
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
app/ (Next.js Framework)
       ↓ (uses)
src/presentation/ (React Components)
       ↓ (calls)
src/application/ (Use Cases)
       ↓ (depends on)
src/domain/ (Business Logic)
       ↑ (implements interfaces)
src/infrastructure/ (Implementations)
```

**Key Insight**: `app/` and `src/` are separate!
- `app/` = Framework-specific (Next.js routing)
- `src/` = Portable business logic (works with any framework)

## Example Data Flow: Create User

```
1. User fills form in UI
   └─→ src/presentation/components/features/create-user-form.tsx

2. Form submits to Server Action
   └─→ app/actions/user-actions.ts
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

- **Framework Independence**: `src/` is completely independent of Next.js
  - Can migrate to Remix, Astro, or any other framework
  - Just need to rewrite `app/` folder, keep all business logic
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Flexibility**: Easy to swap implementations (e.g., change database)
- **Clear Boundaries**: Each layer has a single responsibility
- **Business Logic Protection**: Domain layer is pure, no framework coupling
- **Portability**: Move `src/` to any project or monorepo
