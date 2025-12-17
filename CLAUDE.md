# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router with TypeScript, React 19, and Tailwind CSS v4. The project follows **Clean Architecture** principles with clear separation of concerns.

## Development Commands

- `pnpm dev` - Start development server (opens at http://localhost:3000)
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

This project uses **pnpm** as the package manager.

## Architecture

### Clean Architecture Structure

The codebase follows **true framework independence**:
- **`src/`** - Pure TypeScript business logic (portable to ANY framework: React, Vue, Svelte, Angular)
- **`app/`** - Next.js App Router (React/Next.js specific framework layer)
- **`components/`** - React components (React-specific, follows shadcn/ui convention)

Business logic is organized into three layers inside `src/` (pure TypeScript only):

#### 1. Domain Layer (`src/domain/`)
The core business logic, completely independent of frameworks and external concerns.
- **entities/** - Core business objects with identity
- **repositories/** - Repository interfaces (not implementations)
- **services/** - Domain services for business logic that doesn't fit in entities

**Rules:**
- No dependencies on other layers
- Pure TypeScript - no framework dependencies
- Contains only business rules and domain logic

#### 2. Application Layer (`src/application/`)
Orchestrates the flow of data and implements application services.
- **services/** - Application services with business logic (one service can handle multiple related operations)
- **dtos/** - Data Transfer Objects (Laravel-style organization)
  - **dtos/requests/** - Request DTOs for input (similar to Laravel FormRequests)
  - **dtos/responses/** - Response DTOs for output (similar to Laravel API Resources)

**Rules:**
- Depends only on domain layer
- No UI or database implementation details
- Defines interfaces for external services when needed
- Services are classes that can contain multiple related methods

**DTO Organization (Laravel-style):**
```
src/application/dtos/
├── requests/           # Input DTOs
│   ├── auth/
│   │   └── login.request.ts
│   └── index.ts
├── responses/          # Output DTOs
│   ├── auth/
│   │   └── login.response.ts
│   └── index.ts
└── index.ts           # Re-exports all DTOs
```

- **Requests**: Input data structures (like Laravel FormRequests)
- **Responses**: Output data structures (like Laravel API Resources)
- **Entities**: Business objects remain in `@/domain/entities/`
- Import from: `@/application/dtos/requests/...` or `@/application/dtos/responses/...`

#### 3. Infrastructure Layer (`src/infrastructure/`)
Implements interfaces defined in domain and application layers.
- **persistence/** - Database implementations, repository implementations
- **external-services/** - Third-party API clients, integrations
- **di/** - Dependency Injection container configuration (TSyringe)
- **auth/** - Authentication configuration (NextAuth.js)

**Rules:**
- Implements repository interfaces from domain layer
- Contains framework-specific and third-party integrations
- Depends on domain and application layers
- Configures dependency injection and authentication
- **Pure TypeScript only** - no React/UI code

### React/Next.js Framework Layer

All React and Next.js specific code lives OUTSIDE of `src/`:

#### Components (`/components/`)
React components following shadcn/ui convention (at project root).
- **components/ui/** - shadcn/ui components
- **components/features/** - Feature-specific components

**Rules:**
- React-specific code
- Can use services from `src/application/`
- Follows shadcn/ui convention (components at root)

#### Next.js App Router (`/app/`)
Next.js pages, layouts, and framework-specific code.
- **app/(routes)/** - Pages and layouts (Next.js App Router)
- **app/actions/** - Server Actions
- **app/stores/** - Zustand stores for state management
  - **stores/app/** - Application state (auth, user session)
  - **stores/ui/** - UI state (modals, theme, loading)

**Rules:**
- Next.js and React specific
- Can use services from `src/application/`
- All React state management (Zustand) lives here

### State Management with Zustand

**Where**: `app/stores/` (Next.js/React framework layer)

Zustand stores are React hooks, so they live in the `app/` layer (NOT in `src/`).

**Organization:**
```
app/
├── types/             # Client-side type definitions (plain objects)
│   ├── auth.types.ts  # Auth DTOs for client
│   └── tank.types.ts  # Tank DTOs for client
│
├── actions/           # Server Actions (serialization boundary)
│   ├── auth.actions.ts # Calls services, serializes responses
│   └── tank.actions.ts # Calls services, serializes responses
│
└── stores/            # Zustand stores
    ├── app/           # Application state
    │   ├── auth.store.ts  # Uses actions & types
    │   └── tank.store.ts  # Uses actions & types
    └── ui/            # Pure UI state
        └── modal.store.ts
```

**Key Pattern - Server Actions as Serialization Bridge:**
```typescript
// ✅ CORRECT: Store → Server Action → Service
// app/stores/app/auth.store.ts
import { create } from 'zustand'
import { loginAction } from '@/app/actions'  // ✅ Call action, not service!
import type { ClientUser, LoginRequestDTO } from '@/app/types'

interface AuthStoreState {
  data: { user: ClientUser | null }  // Separate data from UI
  ui: { isLoading: boolean; error: string | null }
  login: (request: LoginRequestDTO) => Promise<void>
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  data: { user: null },
  ui: { isLoading: false, error: null },

  login: async (request) => {
    set({ ui: { isLoading: true, error: null } })
    const result = await loginAction(request)  // ✅ Server Action handles serialization
    if (result.success) {
      set({ data: { user: result.user }, ui: { isLoading: false, error: null } })
    }
  }
}))
```

```typescript
// ❌ WRONG: Importing from src/ or calling services directly
import { getService } from '@/infrastructure/di'  // ❌ Don't import from src/!
import type { LoginRequest } from '@/application/dtos'  // ❌ Don't use server DTOs!

export const useAuthStore = create((set) => ({
  login: async (request) => {
    const authService = getService('AuthService')  // ❌ No direct service calls!
    const result = await authService.login(request)
  }
}))
```

**Benefits:**
- ✅ Complete separation: `app/` never imports from `src/`
- ✅ Server Actions handle serialization (classes → plain objects)
- ✅ Type-safe across client/server boundary
- ✅ Domain entities can be classes with methods

**Import from:**
```typescript
import { useAuthStore } from '@/stores/app/auth.store'
import { loginAction } from '@/app/actions'
import type { ClientUser } from '@/app/types'
```

### Why This Architecture?

**True Framework Independence:**
- `src/` contains ONLY pure TypeScript (NO React, NO Next.js, NO frameworks)
- You can port `src/` to ANY framework: Vue, Svelte, Angular, etc.
- React/Next.js code lives in `app/` and `components/`
- Business logic is 100% portable and reusable

### Dependency Flow

```
┌──────────────────────────────────────────────────────────┐
│ Client Layer (app/)                                       │
│                                                           │
│  Components → Stores → Server Actions (Serialization)    │
│                              ↓                            │
└──────────────────────────────┼────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────┐
│ Server Layer (src/)                                       │
│                                                           │
│  Services → Repositories → Domain Entities                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Data Flow with Server Actions:**
```
1. Component calls store action
   ↓
2. Store calls Server Action (app/actions/)
   ↓
3. Server Action calls Service (src/application/)
   ↓
4. Service calls Repository (src/infrastructure/)
   ↓
5. Repository returns Domain Entity
   ↓
6. Service processes and returns to Action
   ↓
7. Action serializes (class → plain object) and returns DTO
   ↓
8. Store updates state with plain object DTO
   ↓
9. Component re-renders with new state
```

**Key Points:**
- ✅ **Server Actions** are the serialization boundary (classes → plain objects)
- ✅ `app/` never imports from `src/` (complete separation)
- ✅ `src/` is pure TypeScript (portable to any framework)
- ✅ Type-safe across client/server boundary

### TypeScript Path Aliases
All imports should use TypeScript path aliases defined in [tsconfig.json](tsconfig.json):

**Business Logic Layer (src/):**
- `@/domain/*` - Domain layer (pure TypeScript)
- `@/application/*` - Application layer (pure TypeScript)
- `@/infrastructure/*` - Infrastructure layer (pure TypeScript)

**Framework Layer (app/, components/):**
- `@/app/*` - Next.js App Router
- `@/stores/*` - Zustand stores (React state)
- `@/components/*` - React components (shadcn/ui)
- `@/lib/*` - Utility functions

Examples:
```typescript
// Business logic (src/)
import { User } from '@/domain/entities/user'
import { AuthService } from '@/application/services/auth.service'
import { LoginRequest } from '@/application/dtos'

// Framework layer (app/, components/)
import { useAuthStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Next.js App Router
- Uses Next.js 16 with App Router (not Pages Router)
- Entry point: [app/page.tsx](app/page.tsx)
- Root layout: [app/layout.tsx](app/layout.tsx)
- All routes in `app/` directory (at project root)

### Styling
- Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`)
- Global styles: [app/globals.css](app/globals.css)
- Uses CSS variables for theming
- Dark mode supported via class-based strategy

### shadcn/ui Integration
- Configuration: [components.json](components.json)
- Style: "new-york"
- Components go in `@/presentation/components/ui/`
- Icon library: lucide-react
- RSC mode enabled (React Server Components)

### Utility Functions
- `cn()` function in [src/lib/utils.ts](src/lib/utils.ts) - Merges Tailwind classes using clsx and tailwind-merge
- Always use `cn()` for conditional className logic

## Dependency Injection (NestJS/Laravel Style!)

This project uses **auto-resolving DI** - clean, simple, and type-safe!

### Quick Usage

```typescript
import { getService } from '@/infrastructure/di'

// ✨ One line - auto-resolves with type safety!
const authService = getService('AuthService')
await authService.login({ email, password })
```

### Complete Example

```typescript
'use server'

import { getService } from '@/infrastructure/di'

export async function loginUser(formData: FormData) {
  const authService = getService('AuthService')
  return await authService.login({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
}
```

### Key Benefits

- ✅ **One-line resolution**: `getService('AuthService')`
- ✅ **Type-safe**: TypeScript autocomplete & error checking
- ✅ **Auto-resolves dependencies**: No manual wiring needed
- ✅ **Similar to NestJS/Laravel**: Familiar developer experience

### Adding New Services

1. Create service in `src/application/services/`
2. Add to `DI_TOKENS` and `ServiceMap` in `container.ts`
3. Register in `configureDependencies()`
4. Use with `getService('YourService')`

See [src/infrastructure/di/README.md](src/infrastructure/di/README.md) for detailed documentation.

## Key Dependencies

- Next.js 16.0.6 with React 19.2.0
- Tailwind CSS v4 with `@tailwindcss/postcss`
- shadcn/ui utilities: `class-variance-authority`, `clsx`, `tailwind-merge`
- Icons: `lucide-react`
- Dependency Injection: `tsyringe`, `reflect-metadata`
- Authentication: `next-auth@beta` (v5)

## File Organization

### Authentication
- **`src/infrastructure/auth/`** - NextAuth.js configuration
  - `config.ts` - Auth configuration (routes, callbacks)
  - `index.ts` - Main auth setup with providers
  - Import from: `@/infrastructure/auth`

### Documentation
- **`docs/`** - All project documentation
  - `ARCHITECTURE.md` - Clean architecture guide
  - `NESTJS_INTEGRATION.md` - Backend integration guide
  - `SETUP_COMPLETE.md` - Setup checklist
- **`CLAUDE.md`** (root) - Quick reference for development
- **`README.md`** (root) - Project overview

### Route Groups
- **`app/(authenticated)/`** - Protected routes requiring login
  - `dashboard/` - Dashboard page
  - `diagnosis/` - Fish diagnosis feature
  - `layout.tsx` - Shared layout with sidebar
- **`app/login/`** - Public login page (no sidebar)

## ESLint Configuration

Uses flat config format in [eslint.config.mjs](eslint.config.mjs) with Next.js core-web-vitals and TypeScript presets.
