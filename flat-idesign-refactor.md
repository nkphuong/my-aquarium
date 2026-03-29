# Flat IDesign Architecture Refactor

## Goal

Refactor from **Clean Architecture** (6+ layers) to **Flat IDesign** (4 layers) pattern optimized for Next.js frontend-only application.

**Data Flow:**
```
[Pages/Components] → [Server Actions] → [Accessors] → [Backend API]
                            ↓
                     [lib/types] (single source of truth)
```

## ✅ Implementation Status

**ALL PHASES COMPLETE!**

- **Date:** 2026-01-23
- **Status:** Production Ready

### Architecture Overview

```
lib/
├── types/                 # ✅ SINGLE SOURCE OF TRUTH
│   ├── tank.ts
│   ├── user.ts
│   ├── auth.ts
│   ├── api.ts
│   ├── next-auth.d.ts     # Type augmentation
│   └── index.ts
│
├── accessors/             # ✅ DATA ACCESS (IDesign Accessors)
│   ├── base.accessor.ts
│   ├── tank.accessor.ts
│   ├── user.accessor.ts
│   └── index.ts
│
├── api/                   # ✅ HTTP CLIENT
│   ├── client.ts
│   └── index.ts
│
├── auth/                  # ✅ AUTH HELPERS
│   ├── token.ts
│   ├── client.ts
│   ├── config.ts          # NextAuth config
│   ├── nextauth.ts        # NextAuth instantiation
│   └── index.ts
│
├── errors/                # ✅ ERROR TYPES
│   ├── auth.error.ts
│   └── index.ts
│
└── utils.ts
```

### Key Changes
1. **Removed `src/`**: All backend logic moved to `lib/` (Flat IDesign).
2. **Simplified Auth**: NextAuth now calls `userAccessor` directly (no DI, no Services).
3. **Server Components**: Pages fetch data directly using Accessors.
4. **Types**: Single source of truth in `lib/types`.

---

## Build Status

```bash
✅ pnpm tsc --noEmit    # Passed
✅ pnpm build           # Passed
```

## Notes for Developers

- **Adding a Feature**:
  1. Add types to `lib/types/`
  2. Create Accessor in `lib/accessors/` (extends BaseAccessor)
  3. Create Server Action in `app/actions/` (calls Accessor)
  4. Create Server Component Page (calls Action)

- **Authentication**:
  - Use `auth()` for server-side session
  - Use `userAccessor` for login/register logic
  - Types defined in `lib/types/next-auth.d.ts`

---

## ✅ Plan Approved & Implemented

- [x] User approved plan on 2026-01-23
- [x] DI container removed
- [x] src/ folder removed
- [x] All compiled & verified
