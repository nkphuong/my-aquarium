# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router with TypeScript, React 19, and Tailwind CSS v4. The project follows **IDesign architecture** (Juval Lowy's "Righting Software") with volatility-based decomposition.

## Development Commands

- `pnpm dev` - Start development server (opens at http://localhost:3000)
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

This project uses **pnpm** as the package manager.

## Architecture (IDesign-Inspired)

The codebase follows **IDesign's 4-layer architecture** based on volatility-based decomposition:

```
┌─────────────────────────────────────────────────────────┐
│ Managers (app/actions/)                                  │
│ Orchestration, workflow, Server Actions                  │
│ High volatility - changes with requirements              │
├─────────────────────────────────────────────────────────┤
│ Engines (lib/engines/)                                   │
│ Business logic, validation, rules, calculations          │
│ Medium volatility - changes with business rules          │
├─────────────────────────────────────────────────────────┤
│ Accessors (lib/accessors/)                               │
│ Data access, API calls, transformations                  │
│ Low volatility - stable data operations                  │
├─────────────────────────────────────────────────────────┤
│ Resources (lib/api/, lib/auth/, lib/errors/)             │
│ HTTP client, auth helpers, utilities                     │
│ Very low volatility - infrastructure concerns            │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

```
my-aquarium/
├── lib/                    # Business logic layer (IDesign layers)
│   ├── engines/            # Business rules & validation
│   │   ├── tank.engine.ts
│   │   ├── auth.engine.ts
│   │   ├── dashboard.engine.ts
│   │   └── index.ts
│   ├── accessors/          # Data access layer
│   │   ├── base.accessor.ts
│   │   ├── tank.accessor.ts
│   │   ├── user.accessor.ts
│   │   └── index.ts
│   ├── api/                # HTTP client (Resource)
│   │   └── client.ts
│   ├── auth/               # Authentication (Resource)
│   │   ├── nextauth.ts
│   │   ├── config.ts
│   │   └── token.ts
│   ├── types/              # Type definitions
│   │   ├── tank.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── api.ts
│   └── errors/             # Error handling (Utility)
│       └── auth.error.ts
│
├── app/                    # Next.js framework layer
│   ├── (authenticated)/    # Protected routes
│   │   ├── dashboard/
│   │   ├── tanks/
│   │   └── layout.tsx
│   ├── actions/            # Server Actions (Managers)
│   │   ├── tank.actions.ts
│   │   └── index.ts
│   ├── stores/             # Zustand (UI state only)
│   │   └── ui/
│   ├── login/
│   └── register/
│
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── features/           # Business features
│   ├── dashboard/          # Dashboard components
│   └── tanks/              # Tank components
│
└── hooks/                  # Custom React hooks
```

### IDesign Principles Applied

#### 1. Managers (Server Actions)
Location: `app/actions/`

Orchestrate operations by calling Engines and Accessors:
```typescript
// app/actions/tank.actions.ts
export async function createTank(input: CreateTankInput) {
  // 1. Validate with Engine (business rules)
  const validation = tankEngine.validateCreateInput(input)
  if (!validation.valid) {
    return { success: false, error: validation.errors?.join(', ') }
  }

  // 2. Create with Accessor (data access)
  const tank = await tankAccessor.create(input)

  // 3. Enrich with Engine (calculated properties)
  const enriched = tankEngine.enrichTankWithStats(tank)

  return { success: true, tank: enriched }
}
```

#### 2. Engines (Business Logic)
Location: `lib/engines/`

Handle validation, calculations, and business rules:
```typescript
// lib/engines/tank.engine.ts
class TankEngineClass {
  validateCreateInput(input: CreateTankInput): ValidationResult { ... }
  calculateWaterVolume(width, height, length): number { ... }
  enrichTankWithStats(tank: Tank): EnrichedTank { ... }
}
export const tankEngine = new TankEngineClass()
```

#### 3. Accessors (Data Access)
Location: `lib/accessors/`

Handle API calls and data transformation:
```typescript
// lib/accessors/tank.accessor.ts
class TankAccessorClass extends BaseAccessor {
  async findMyTanks(filters?: TankFilters): Promise<Tank[]> {
    const client = await this.getClient()
    const response = await client.get('/tank/my-tanks').send()
    return this.toDomainArray(response.data)
  }
}
export const tankAccessor = new TankAccessorClass()
```

#### 4. Resources (Infrastructure)
Location: `lib/api/`, `lib/auth/`, `lib/errors/`

HTTP client, authentication, utilities.

### Key Patterns

#### Data Flow (IDesign compliant)
```
Component → Server Action → Engine → Accessor → HTTP Client → Backend
                              ↓
                    Validation + Enrichment
```

#### Server Actions as Serialization Boundary
- Server Actions return plain objects (DTOs)
- Components never import directly from `lib/`
- Type-safe across client/server boundary

#### Singleton Accessors
```typescript
// Accessors are exported as singletons
export const tankAccessor = new TankAccessorClass()
export const userAccessor = new UserAccessorClass()
```

### TypeScript Path Aliases

```typescript
// Business Logic (lib/)
import { tankEngine } from '@/lib/engines'
import { tankAccessor } from '@/lib/accessors'
import type { Tank } from '@/lib/types'

// Framework Layer (app/, components/)
import { getTanks } from '@/actions/tank.actions'
import { useModalStore } from '@/stores'
import { Button } from '@/components/ui/button'
```

Configured in `tsconfig.json`:
- `@/lib/*` → `./lib/*`
- `@/engines/*` → `./lib/engines/*`
- `@/actions/*` → `./app/actions/*`
- `@/stores/*` → `./app/stores/*`
- `@/components/*` → `./components/*`
- `@/hooks/*` → `./hooks/*`

### State Management

**Zustand stores** are for UI state only:
- Location: `app/stores/ui/`
- No business logic in stores
- Data fetching happens in Server Components

**Server Components First**:
- Fetch data in Server Components
- Pass data as props to Client Components
- Use Server Actions for mutations

### Authentication

Uses NextAuth.js v5:
- Configuration: `lib/auth/nextauth.ts`
- Token management: `lib/auth/token.ts`
- Protected routes: `app/(authenticated)/layout.tsx`

### Key Dependencies

- Next.js 16.0.6 with React 19.2.0
- Tailwind CSS v4 with `@tailwindcss/postcss`
- shadcn/ui utilities: `class-variance-authority`, `clsx`, `tailwind-merge`
- Icons: `lucide-react`
- Authentication: `next-auth@beta` (v5)

### Styling

- Tailwind CSS v4 with PostCSS plugin
- Global styles: `app/globals.css`
- Uses CSS variables for theming
- Light theme with pastel colors for dashboard

### shadcn/ui Integration

- Configuration: `components.json`
- Style: "new-york"
- Components: `components/ui/`
- RSC mode enabled

### Utility Functions

- `cn()` function in `lib/utils.ts` - Merges Tailwind classes
- Always use `cn()` for conditional className logic

### Route Groups

- `app/(authenticated)/` - Protected routes (dashboard, tanks, diagnosis)
- `app/login/` - Public login page
- `app/register/` - Public registration page

## Adding New Features

### 1. Add a New Engine
```bash
# Create engine file
lib/engines/my-feature.engine.ts

# Export from index
lib/engines/index.ts
```

### 2. Add a New Accessor
```bash
# Create accessor extending BaseAccessor
lib/accessors/my-feature.accessor.ts

# Export from index
lib/accessors/index.ts
```

### 3. Add a New Server Action
```bash
# Create action file using Engine + Accessor
app/actions/my-feature.actions.ts
```

### Architecture References

- [Righting Software](https://rightingsoftware.org/) by Juval Lowy
- [IDesign Official](https://www.idesign.net/Books/Righting-Software)
