# Architecture Decision: Framework Independence

## The Question

**Where should Zustand stores go in Clean Architecture?**

This question reveals a deeper architectural decision: **How framework-agnostic should `src/` be?**

## Current State (Inconsistent)

```
src/presentation/
├── components/ui/        # shadcn/ui - REACT SPECIFIC
├── components/features/  # React components - REACT SPECIFIC
├── hooks/                # Custom React hooks - REACT SPECIFIC
└── stores/               # Zustand stores - REACT SPECIFIC
```

**Problem:** CLAUDE.md says "framework-independent" but everything in `src/presentation/` is React-specific!

## Two Options

### Option A: React-Portable (Not Truly Framework-Agnostic)

**Philosophy:** `src/` can be ported across React frameworks (Next.js → Remix → Gatsby)

**Structure:**
```
src/
├── domain/           # Pure TS
├── application/      # Pure TS
├── infrastructure/   # Pure TS (DI, repositories)
└── presentation/     # React-specific
    ├── components/
    ├── hooks/
    └── stores/       # ✅ Zustand HERE
```

**Pros:**
- ✅ Clean separation of React UI from Next.js routing
- ✅ Can reuse across React-based frameworks
- ✅ All React code stays together in `src/presentation/`
- ✅ Familiar pattern for React developers

**Cons:**
- ❌ NOT truly framework-agnostic (can't use with Vue/Svelte)
- ❌ Presentation layer is framework-specific (contradicts Clean Architecture purists)

**Best for:**
- Teams committed to React ecosystem
- Apps that might migrate between React frameworks (Next.js ↔ Remix)
- When you want reusable React components across projects

---

### Option B: Truly Framework-Agnostic

**Philosophy:** `src/` has ZERO framework dependencies - pure TypeScript business logic

**Structure:**
```
src/
├── domain/           # Pure TS - entities, value objects
├── application/      # Pure TS - services, DTOs
└── infrastructure/   # Pure TS - repositories, DI
    # NO presentation layer!

app/                  # ALL framework code here
├── components/       # React components (from src/presentation)
├── hooks/            # React hooks (from src/presentation)
├── stores/           # ✅ Zustand HERE (Next.js/React layer)
├── actions/          # Server Actions
└── (routes)/         # Pages, layouts
```

**Pros:**
- ✅ `src/` is truly portable to ANY framework (Vue, Svelte, Angular)
- ✅ Follows Clean Architecture strictly (no framework in inner layers)
- ✅ Maximum flexibility for future framework changes
- ✅ Business logic 100% independent

**Cons:**
- ❌ Less clear separation between Next.js and React code
- ❌ `app/` folder gets larger
- ❌ Can't easily share React components between projects

**Best for:**
- Apps that might switch frameworks entirely (React → Vue)
- Microservices where different services use different frameworks
- When maximum portability is required
- Following Clean Architecture strictly

---

## Recommendation Based on Your Goals

### If you want **maximum portability**: Choose **Option B**

```
# Your stated goal from CLAUDE.md:
"src/ contains portable business logic that could work with any framework"
```

This means:
- ✅ Zustand stores → `app/stores/` (React-specific)
- ✅ React components → `app/components/` (React-specific)
- ✅ React hooks → `app/hooks/` (React-specific)
- ✅ `src/` → Pure TypeScript only

**Result:** You can use `src/` with Vue, Svelte, Angular, etc.

---

### If you want **React portability**: Choose **Option A**

```
# Modified goal:
"src/ contains portable business logic that works with React-based frameworks"
```

This means:
- ✅ Zustand stores → `src/presentation/stores/` (OK)
- ✅ React components → `src/presentation/components/` (OK)
- ✅ React hooks → `src/presentation/hooks/` (OK)

**Result:** You can port `src/` to Remix, Gatsby, Astro (but not Vue/Svelte)

---

## What Clean Architecture Actually Says

Uncle Bob's Clean Architecture doesn't forbid framework-specific code in outer layers:

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers (OUTERMOST)   │  ← React, Next.js OK here
│  ┌───────────────────────────────┐  │
│  │  Interface Adapters           │  │  ← React components OK here
│  │  ┌─────────────────────────┐ │  │
│  │  │  Application Business   │ │  │  ← Pure TypeScript
│  │  │  Rules                  │ │  │
│  │  │  ┌───────────────────┐  │ │  │
│  │  │  │    Entities       │  │ │  │  ← Pure TypeScript
│  │  │  │  (Domain)         │  │ │  │
│  │  │  └───────────────────┘  │ │  │
│  │  └─────────────────────────┘ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Key Principle:** Dependencies point INWARD only
- Outer layers CAN be framework-specific
- Inner layers MUST be framework-independent

**In your project:**
- `src/domain/` + `src/application/` = Inner layers (MUST be pure)
- `src/infrastructure/` + `src/presentation/` = Outer layers (CAN be framework-specific)
- `app/` = Outermost layer (Next.js specific)

---

## Decision Matrix

| Criteria | Option A (React-Portable) | Option B (Framework-Agnostic) |
|----------|---------------------------|-------------------------------|
| **Zustand Location** | `src/presentation/stores/` | `app/stores/` |
| **Can use with Remix?** | ✅ Yes | ✅ Yes |
| **Can use with Vue?** | ❌ No | ✅ Yes |
| **Follows your stated goal?** | ❌ No (contradicts "any framework") | ✅ Yes |
| **Clean Architecture?** | ⚠️  Flexible interpretation | ✅ Strict interpretation |
| **Complexity** | Lower (familiar pattern) | Higher (bigger app/ folder) |
| **React component reuse** | ✅ Easy | ❌ Harder |

---

## My Recommendation

Based on your CLAUDE.md statement:
> "`src/` contains portable business logic that could work with any framework"

**Choose Option B** - Move all React-specific code to `app/`:

1. Move Zustand stores → `app/stores/`
2. Move React components → `app/components/`
3. Move React hooks → `app/hooks/`
4. Keep `src/` = Pure TypeScript (domain, application, infrastructure)

This gives you TRUE framework independence and follows Clean Architecture strictly.

---

## Alternative: Update Your Goals

If you're realistically staying in the React ecosystem, update CLAUDE.md to say:

> "`src/` contains portable business logic that works with React-based frameworks"

Then **Option A** is fine, and Zustand can stay in `src/presentation/stores/`.

---

## Questions to Decide

1. **Will you ever switch from React to Vue/Svelte/Angular?**
   - No → Option A is fine
   - Maybe → Choose Option B

2. **Do you want to reuse React components across projects?**
   - Yes → Option A
   - No → Option B

3. **Is strict Clean Architecture important?**
   - Yes → Option B
   - Flexible → Option A

---

## Implementation

If you choose **Option B**, we should:
1. Remove `src/presentation/` entirely
2. Move all React code to `app/`
3. Update CLAUDE.md to reflect true framework independence
4. Place Zustand stores in `app/stores/`

If you choose **Option A**, we should:
1. Keep current structure
2. Update CLAUDE.md to say "React-portable" instead of "framework-independent"
3. Place Zustand stores in `src/presentation/stores/`

**What's your preference?**
