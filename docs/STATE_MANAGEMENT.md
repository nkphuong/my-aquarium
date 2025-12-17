# State Management with Zustand

## Where Zustand Stores Belong

**Answer: `app/stores/`** ✅ (Next.js/React framework layer)

## Why app/ Layer?

Zustand stores are **React hooks** (framework-specific), so they belong in the `app/` layer with other React/Next.js code.

**Not in `src/`** because `src/` is pure TypeScript (portable to ANY framework: Vue, Svelte, Angular, etc.)

## Server Actions as Serialization Boundary

**Key Architecture Decision:** Server Actions act as the **bridge** between client (app/) and server (src/).

```
app/stores/ (Client State)
    ↓ calls
app/actions/ (Serialization Boundary) ← YOU ARE HERE
    ↓ calls
src/application/services/ (Business Logic)
    ↓ uses
src/domain/entities/ (Domain Models)
```

**Why Server Actions?**
- ✅ Complete separation: `app/` never imports from `src/`
- ✅ Handles serialization automatically (classes → plain objects)
- ✅ Type-safe across client/server boundary
- ✅ Domain entities can be classes with methods

## Architecture Principle

```
┌────────────────────────────────────────────────────────────┐
│ Client Layer (app/)                                        │
│                                                            │
│  ┌────────────┐        ┌──────────────┐                  │
│  │  Store     │ calls  │ Server Action│  (Serialization) │
│  │ (app/stores│ ────> │ (app/actions)│  ← Boundary      │
│  └────────────┘        └──────┬───────┘                  │
│                                │                           │
└────────────────────────────────┼───────────────────────────┘
                                 │ calls
┌────────────────────────────────▼───────────────────────────┐
│ Server Layer (src/)                                        │
│                                                            │
│  ┌──────────────┐        ┌──────────────┐                │
│  │  Service     │ uses   │  Domain      │                │
│  │ (src/app/)   │ ────> │  Entities    │                │
│  └──────────────┘        └──────────────┘                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key Rules:**
1. **Stores manage STATE** (app/stores/ - React hooks)
2. **Server Actions are the BRIDGE** (app/actions/ - serialization boundary)
3. **Services contain LOGIC** (src/application/ - pure TypeScript)
4. **Entities are PURE** (src/domain/ - can be classes)
5. **Complete separation**: app/ NEVER imports from src/

## Folder Structure

```
app/
├── types/                    # Client-side type definitions (plain objects)
│   ├── auth.types.ts         # ClientUser, LoginRequestDTO, LoginResponseDTO
│   ├── tank.types.ts         # ClientTank, GetTanksResponseDTO
│   └── index.ts              # Re-exports
│
├── actions/                  # Server Actions (serialization boundary)
│   ├── auth.actions.ts       # loginAction, logoutAction
│   ├── tank.actions.ts       # getTanksAction, createTankAction
│   └── index.ts              # Re-exports
│
└── stores/                   # Zustand stores (React hooks)
    ├── app/                  # Application-wide state
    │   ├── auth.store.ts     # Uses auth actions & types
    │   ├── tank.store.ts     # Uses tank actions & types
    │   └── user.store.ts     # User profile data
    │
    ├── ui/                   # Pure UI state (no business logic)
    │   ├── modal.store.ts    # Modal open/close state
    │   ├── theme.store.ts    # Light/dark theme
    │   └── sidebar.store.ts  # Sidebar open/close
    │
    └── index.ts              # Re-export all stores
```

## Two Types of Stores

### 1. Application State Stores (`app/stores/app/`)

**Purpose:** Manage application-wide data that involves business logic

**Pattern:** Store calls Server Actions (which call services)

```typescript
// app/stores/app/auth.store.ts
'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { loginAction, logoutAction } from '@/app/actions'  // ✅ Call actions, not services!
import type { ClientUser, LoginRequestDTO } from '@/app/types'  // ✅ Use client types!

interface AuthStoreState {
  // Separate data from UI
  data: {
    user: ClientUser | null
    tokens: { accessToken: string; refreshToken: string; expiresIn: number } | null
  }
  ui: {
    isLoading: boolean
    error: string | null
  }
  isAuthenticated: boolean

  // Actions
  login: (request: LoginRequestDTO) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStoreState>()(
  devtools(
    persist(
      (set) => ({
        data: { user: null, tokens: null },
        ui: { isLoading: false, error: null },
        isAuthenticated: false,

        // ✅ Store calls Server Action (the serialization bridge)
        login: async (request) => {
          set({ ui: { isLoading: true, error: null } })

          const result = await loginAction(request)  // Server Action handles serialization

          if (result.success && result.user) {
            set({
              data: { user: result.user, tokens: result.tokens || null },
              ui: { isLoading: false, error: null },
              isAuthenticated: true
            })
          } else {
            set({
              data: { user: null, tokens: null },
              ui: { isLoading: false, error: result.error || 'Login failed' },
              isAuthenticated: false
            })
          }
        },

        logout: async () => {
          await logoutAction()
          set({
            data: { user: null, tokens: null },
            ui: { isLoading: false, error: null },
            isAuthenticated: false
          })
        },

        clearError: () => {
          set((state) => ({ ui: { ...state.ui, error: null } }))
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          data: state.data,
          isAuthenticated: state.isAuthenticated
        })
      }
    )
  )
)

// Convenience selectors
export const selectUser = (state: AuthStoreState) => state.data.user
export const selectIsLoading = (state: AuthStoreState) => state.ui.isLoading
```

**Server Action Example:**
```typescript
// app/actions/auth.actions.ts
'use server'

import { getService } from '@/infrastructure/di'
import type { LoginRequestDTO, LoginResponseDTO } from '@/app/types'

export async function loginAction(request: LoginRequestDTO): Promise<LoginResponseDTO> {
  try {
    const authService = getService('AuthService')
    const result = await authService.login({ email: request.email, password: request.password })

    // Serialize service response to plain object
    if (result.success && result.user) {
      return {
        success: true,
        user: {
          id: result.user.id,
          authId: result.user.authId,
          fullname: result.user.fullname
        },
        tokens: result.accessToken ? {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken!,
          expiresIn: result.expiresIn!
        } : undefined
      }
    }
    return { success: false, error: result.error || 'Login failed' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
```

**When to use:**
- User authentication & session
- Data that requires validation or business rules
- State that interacts with backend APIs
- Application settings that affect business logic

### 2. UI State Stores (`app/stores/ui/`)

**Purpose:** Manage pure UI state with no business logic

**Pattern:** No service calls needed (simple state management)

```typescript
// app/stores/ui/modal.store.ts

import { create } from 'zustand'

interface ModalState {
  isOpen: boolean
  type: 'confirm' | 'alert' | null
  openModal: (type: ModalState['type']) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,

  // ✅ Pure UI state - no business logic needed
  openModal: (type) => set({ isOpen: true, type }),
  closeModal: () => set({ isOpen: false, type: null }),
}))
```

**When to use:**
- Modal open/close state
- Theme (light/dark mode)
- Sidebar collapsed/expanded
- Loading spinners
- Toast notifications
- Form field focus state

## Clean Architecture Compliance

### ✅ CORRECT Pattern (with Server Actions)

```typescript
// 1. Client Types (app/types/auth.types.ts)
export interface ClientUser {
  id: string
  authId: string
  fullname?: string
}

export interface LoginRequestDTO {
  email: string
  password: string
}

export interface LoginResponseDTO {
  success: boolean
  user?: ClientUser
  tokens?: { accessToken: string; refreshToken: string; expiresIn: number }
  error?: string
}
```

```typescript
// 2. Server Action (app/actions/auth.actions.ts) - Serialization Bridge
'use server'

import { getService } from '@/infrastructure/di'
import type { LoginRequestDTO, LoginResponseDTO } from '@/app/types'

export async function loginAction(request: LoginRequestDTO): Promise<LoginResponseDTO> {
  const authService = getService('AuthService')  // ✅ Call service (server-side)
  const result = await authService.login(request)

  // ✅ Serialize to plain object for client
  if (result.success && result.user) {
    return {
      success: true,
      user: { id: result.user.id, authId: result.user.authId, fullname: result.user.fullname },
      tokens: result.accessToken ? { ... } : undefined
    }
  }
  return { success: false, error: result.error }
}
```

```typescript
// 3. Store (app/stores/app/auth.store.ts) - Client State
'use client'

import { create } from 'zustand'
import { loginAction } from '@/app/actions'  // ✅ Call action, not service!
import type { ClientUser, LoginRequestDTO } from '@/app/types'  // ✅ Use client types!

export const useAuthStore = create<AuthStoreState>((set) => ({
  data: { user: null },
  ui: { isLoading: false, error: null },

  login: async (request: LoginRequestDTO) => {
    set({ ui: { isLoading: true, error: null } })
    const result = await loginAction(request)  // ✅ Server Action handles serialization
    if (result.success) {
      set({ data: { user: result.user }, ui: { isLoading: false, error: null } })
    }
  }
}))
```

```typescript
// 4. Service (src/application/services/auth.service.ts) - Business Logic
export class AuthService {
  login(request: LoginRequest): Promise<LoginResponse> {
    // ✅ Business logic here (pure TypeScript, no React)
    if (!this.isValidEmail(request.email)) {
      return { success: false, error: 'Invalid email' }
    }
    // ... more logic
  }
}
```

**Why it's correct:**
- ✅ Complete separation: app/ NEVER imports from src/
- ✅ Server Actions handle serialization (classes → plain objects)
- ✅ Type-safe across client/server boundary
- ✅ src/ can be ported to ANY framework (Vue, Svelte, Angular)
- ✅ Domain entities can be classes with methods
- ✅ Store only knows about client types (plain objects)
- ✅ Service remains pure TypeScript, testable without React

### ❌ WRONG Patterns

**Pattern 1: Store importing from src/ directly**
```typescript
// ❌ WRONG
import { getService } from '@/infrastructure/di'  // ❌ Importing from src/!
import type { LoginRequest } from '@/application/dtos'  // ❌ Server DTOs in client!

export const useAuthStore = create((set) => ({
  login: async (request: LoginRequest) => {
    const authService = getService('AuthService')  // ❌ No direct service calls!
    const result = await authService.login(request)
  }
}))
```

**Pattern 2: Business logic in store**
```typescript
// ❌ WRONG
export const useAuthStore = create((set) => ({
  login: async (email, password) => {
    // ❌ Business logic in store!
    if (!email.includes('@')) {
      throw new Error('Invalid email')
    }

    // ❌ Direct API call in store!
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    // ❌ Data transformation in store!
    const data = await response.json()
    set({ user: { name: data.fullName.toUpperCase() } })
  }
}))
```

**Why these are wrong:**
- ❌ Breaks separation: app/ importing from src/
- ❌ Business logic mixed with UI state
- ❌ Can't test business logic without React
- ❌ Can't port src/ to other frameworks
- ❌ Violates Clean Architecture dependency rule
- ❌ No serialization boundary

## Usage Examples

### In React Components

```typescript
'use client'

import { useAuthStore } from '@/stores'

export function LoginForm() {
  const { login, isLoading, error } = useAuthStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

### With Middleware (Persist, Devtools)

```typescript
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // store implementation
      }),
      { name: 'auth-storage' }
    )
  )
)
```

## Summary

| Aspect | Placement |
|--------|-----------|
| **Where** | `app/stores/` (Next.js/React layer) |
| **Why** | Zustand creates React hooks (framework-specific) |
| **Not in src/** | `src/` is pure TypeScript (portable to ANY framework) |
| **Business Logic** | `src/application/` services (NOT in stores) |
| **Store Purpose** | Manage React state, call services from src/ |
| **Types** | `app/` (with services) & `ui/` (pure state) |

## References

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CLAUDE.md](../CLAUDE.md) - Project architecture guide
