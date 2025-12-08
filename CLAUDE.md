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

The codebase separates the Next.js framework layer from business logic:
- **`app/`** - Next.js App Router (framework layer, at project root)
- **`src/`** - Business logic layers (portable, framework-independent)

Business logic is organized into three main layers inside `src/`:

#### 1. Domain Layer (`src/domain/`)
The core business logic, completely independent of frameworks and external concerns.
- **entities/** - Core business objects with identity
- **value-objects/** - Immutable objects defined by their attributes
- **repositories/** - Repository interfaces (not implementations)
- **services/** - Domain services for business logic that doesn't fit in entities

**Rules:**
- No dependencies on other layers
- Pure TypeScript - no framework dependencies
- Contains only business rules and domain logic

#### 2. Application Layer (`src/application/`)
Orchestrates the flow of data and implements use cases.
- **use-cases/** - Application use cases/interactors
- **dtos/** - Data Transfer Objects for input/output

**Rules:**
- Depends only on domain layer
- No UI or database implementation details
- Defines interfaces for external services when needed

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

#### 4. Presentation Layer (`src/presentation/`)
Reusable UI components (framework-independent).
- **src/presentation/components/ui/** - shadcn/ui components
- **src/presentation/components/features/** - Feature-specific components
- **src/presentation/hooks/** - Custom React hooks

**Rules:**
- Framework-agnostic React components
- Can use application layer use cases
- No Next.js-specific code (that goes in `app/`)

### Next.js App Router Layer (`app/`)
The framework routing layer sits outside `src/` for clear separation:
- **app/** - Next.js pages, layouts, and route handlers
- **app/actions/** - Server Actions (wire up use cases here)

This separation means:
- `src/` contains portable business logic that could work with any framework
- `app/` is the Next.js-specific entry point that uses the business logic
- You can move/reuse `src/` in other projects (Remix, Astro, etc.)

### Dependency Flow
```
app/ (Next.js) → src/presentation/ → src/application/ → src/domain/
                                              ↑
                       src/infrastructure/ ---┘
```

### TypeScript Path Aliases
All imports should use TypeScript path aliases defined in [tsconfig.json](tsconfig.json):
- `@/*` - Maps to `src/*`
- `@/domain/*` - Domain layer
- `@/application/*` - Application layer
- `@/infrastructure/*` - Infrastructure layer
- `@/presentation/*` - Presentation layer

Examples:
```typescript
import { User } from '@/domain/entities/user'
import { CreateUserUseCase } from '@/application/use-cases/create-user'
import { Button } from '@/presentation/components/ui/button'
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

## Dependency Injection

This project uses **TSyringe** for dependency injection to maintain loose coupling and testability.

### Usage

```typescript
import { getContainer, DI_TOKENS } from '@/infrastructure/di'

// Resolve a use case
const container = getContainer()
const loginUseCase = container.resolve<LoginUseCase>(DI_TOKENS.LoginUseCase)
```

### Key Points

- All dependencies are registered in `src/infrastructure/di/container.ts`
- Use `DI_TOKENS` for type-safe dependency resolution
- Domain and application layers remain unaware of DI (no decorators needed)
- Infrastructure layer configures the container
- Presentation layer (app/) resolves dependencies

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
