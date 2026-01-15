---
trigger: always_on
---

This project is using Nextjs 16, with tailswindcss 4.
The API is Nestjs from another project, with supabase as DB provider

This is my pet project, for my aquariums, it aim to make our aquarist hobby become more easy and more excited when mixing the techinical AI, with science about water, bio... 

Always comment in English if needed


I'm applying clean architecture design pattern for this project. Always apply SOLID principles.

the idea is, everything inside the `src/` dir should be easily move to any other typescript frameworks, and it still works at the same 

Should always check the docs from the context7 or the frameworks, libs itself to check the versions, before give the answer

Only answer or generate code when its 80% truth, if you not sure, just tell Need More info.

This project is using tailwindcss 4, always create a new css class for the magic color, size of px, rem.. no hardcode in the tag it self.

Always check the layouts, before adding new components
Always check the provided UI components before create new, you can update the existing one before create new one, only create new when there is no other way.

Each component should be only for 1 feature only.

In each component, it not containing business logic code, it just a presenter to show, handle the clicking.., then it should call to zustand store, to the Nextjs Actions

Always check for the DTOs, i dont want be drowned in the the DTOs layers. We can create as much as we need, just avoiding duplicated & redundanted

The zustand store is in the app/stores, 
the nextjs actions is the Server actions, int the app/stores

## DI - Dependency Inversion
- Using tsyringe
- Define in `src/infrastructure/di`

## UI Component Library
- Using **shadcn/ui** (new-york style) with **Radix UI** primitives
- Icons: **lucide-react**
- All UI components in `components/ui/`
- Add new shadcn components via: `npx shadcn@latest add <component>`
- Always use `cn()` from `@/lib/utils` for className merging

## Component Organization
- `components/ui/` - Reusable UI primitives (shadcn/ui)
- `components/features/` - Feature-specific React components
- `components/dashboard/` - Dashboard-specific components
- `components/tanks/` - Tank-related components

## State Flow (Critical!)
- **Component → Zustand Store → Server Action → Service**
- Stores in `app/stores/` (app/ for data, ui/ for UI state)
- Server Actions in `app/actions/`
- Client types in `app/types/`
- **NEVER** import from `src/` directly in components/stores
- Server Actions are the **serialization boundary** (classes → plain objects)

## Import Rules
- Business logic: `@/domain/*`, `@/application/*`, `@/infrastructure/*`
- Framework: `@/stores/*`, `@/components/*`, `@/lib/*`
- app/ layer NEVER imports from src/ (use Server Actions instead)

## DTO Organization (Laravel-style)
- `src/application/dtos/requests/` - Input DTOs
- `src/application/dtos/responses/` - Output DTOs
- `app/types/` - Client-side types (plain objects for serialization)


## Data Fetching
- **Server Actions** (preferred): `app/actions/` for all Next.js data mutations
- **API Routes** (fallback only): `app/api/` chỉ khi cần cho external clients (React Native)

## Testing (Future)
- Giữ nguyên testing patterns hiện có
- Playwright cho E2E testing (planned)