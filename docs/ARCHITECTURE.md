# Architecture Guide: Flat IDesign

This project follows a **Flat IDesign** architecture, heavily optimized for **Next.js App Router** and **Server Components**.

## Core Philosophy

1.  **Complexity where it belongs**: Complex business logic lives in `lib/`. UI logic lives in `components/`. Routing/Integration lives in `app/`.
2.  **Server-First**: leverage Next.js Server Components for data fetching.
3.  **No "Layers" hell**: We avoid artificial layers like "Domain", "Application", "Infrastructure" in favor of functional grouping.
4.  **Single Source of Truth**: Types are defined once in single place.

## High-Level Structure

```mermaid
graph TD
    Client[Client Component] -->|Calls| Action[Server Action]
    Page[Server Component] -->|Calls| Action
    Action -->|Calls| Accessor[Accessor (lib/accessors)]
    Accessor -->|Calls| API[External Backend API]
    
    subgraph "lib/ (The Core)"
        Accessor
        Types[Types (lib/types)]
    end
    
    subgraph "app/ (The Glue)"
        Page
        Action
    end
```

## The Layers

### 1. `lib/types`: The Single Source of Truth
We do **not** duplicate types (e.g., separate Entity vs DTO vs Client Type). We define the shape of our data **once**.

*   **Location**: `lib/types/*.ts`
*   **Pattern**: Export interfaces that match the API response.
*   **Example**:
    ```typescript
    // lib/types/tank.ts
    export interface Tank {
      id: string;
      name: string;
      gallons: number;
      // ...
    }
    
    export interface CreateTankDTO {
      name: string;
      // ...
    }
    ```

### 2. `lib/accessors`: Data Access Layer
Accessors replace "Services" and "Repositories". They are simple classes responsible for fetching data from the backend API.

*   **Location**: `lib/accessors/*.ts`
*   **Responsibility**:
    *   Construct HTTP requests.
    *   Handle API errors (401, 404, etc.).
    *   Return typed data (using `lib/types`).
    *   **NO** complex business logic (process data on the backend if possible).
*   **Inheritance**: All Accessors extend `BaseAccessor` for shared HTTP client logic.

### 3. `app/actions`: The Boundary
Server Actions act as the secure gateway between the Frontend (Client Components) and the Backend logic (Accessors).

*   **Location**: `app/actions/*.ts`
*   **Responsibility**:
    *   Validate inputs (Zod).
    *   Check Authentication (Get session).
    *   Call Accessors.
    *   Revalidate Path (Cache invalidation).
*   **Note**: Server Components can call Accessors directly if they are read-only, but using Actions for everything provides a consistent API.

### 4. `components`: The UI
Standard React components. They receive data as props. They do **not** fetch data directly (except via hooks calling Actions if really needed, but `useQuery` is avoided in favor of Server Components).

## Key Decisions

### Removal of DI Container
In a Next.js Serverless environment, a heavy Dependency Injection (DI) container is overkill.
*   **Previous**: `container.resolve(UserService)`
*   **Now**: Import `userAccessor` directly from `lib/accessors`.
    ```typescript
    import { userAccessor } from '@/lib/accessors';
    
    // It's a singleton instance exported from the module
    await userAccessor.login(...);
    ```

### Authentication
*   **Library**: NextAuth.js (v5 beta / Auth.js).
*   **Location**: `lib/auth/`.
*   **Flow**:
    1.  User logs in via `app/login`.
    2.  `authorize` callback in `lib/auth/nextauth.ts` calls `userAccessor.login`.
    3.  Tokens (Access/Refresh) are stored in the compilation-encrypted NextAuth session cookie.
    4.  `lib/auth/token.ts` helper extracts the token for usage in Accessors.

## Directory Map

| Path | Purpose |
|------|---------|
| `lib/accessors/` | API Clients (UserAccessor, TankAccessor) |
| `lib/api/` | Base Axios/Fetch wrappers |
| `lib/auth/` | Auth logic, token management |
| `lib/types/` | Shared TypeScript interfaces |
| `app/actions/` | Next.js Server Actions |
| `components/` | Reusable UI components |
