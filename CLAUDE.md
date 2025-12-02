# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router with TypeScript, React 19, and Tailwind CSS v4. The project follows **DDD (Domain-Driven Design)** and **Hexagonal Architecture** principles with clean separation of concerns.

## Development Commands

- `pnpm dev` - Start development server (opens at http://localhost:3000)
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

This project uses **pnpm** as the package manager.

## Architecture

### DDD/Hexagonal Architecture Structure

The codebase is organized into four main layers inside `src/`:

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
- **ports/** - Interfaces for external services

**Rules:**
- Depends only on domain layer
- No UI or database implementation details
- Defines interfaces (ports) for external dependencies

#### 3. Infrastructure Layer (`src/infrastructure/`)
Implements interfaces defined in domain and application layers.
- **persistence/** - Database implementations, repository implementations
- **external-services/** - Third-party API clients, integrations
- **adapters/** - Converters between domain and external formats

**Rules:**
- Implements repository and port interfaces
- Contains framework-specific code
- Depends on domain and application layers

#### 4. Presentation Layer (`src/presentation/` and `src/app/`)
UI components and Next.js routing.
- **src/app/** - Next.js App Router pages and layouts
- **src/presentation/components/ui/** - shadcn/ui components
- **src/presentation/components/features/** - Feature-specific components
- **src/presentation/hooks/** - Custom React hooks

**Rules:**
- Calls application layer use cases
- No direct access to infrastructure or domain layers
- Contains React components and Next.js pages

### Dependency Flow
```
Presentation → Application → Domain
                     ↑
Infrastructure ------┘
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
- Entry point: [src/app/page.tsx](src/app/page.tsx)
- Root layout: [src/app/layout.tsx](src/app/layout.tsx)
- All routes in `src/app/` directory

### Styling
- Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`)
- Global styles: [src/app/globals.css](src/app/globals.css)
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

## Key Dependencies

- Next.js 16.0.6 with React 19.2.0
- Tailwind CSS v4 with `@tailwindcss/postcss`
- shadcn/ui utilities: `class-variance-authority`, `clsx`, `tailwind-merge`
- Icons: `lucide-react`

## ESLint Configuration

Uses flat config format in [eslint.config.mjs](eslint.config.mjs) with Next.js core-web-vitals and TypeScript presets.
