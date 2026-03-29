# API & Data Access Guide

This guide explains how to fetch and mutate data in the application using the **Accessor + Server Action** pattern.

## The Pattern

We use a 3-step pattern for all data interactions:

1.  **Accessor** (`lib/accessors`): The low-level API client.
2.  **Server Action** (`app/actions`): The secure, public-facing function.
3.  **Component** (`components` or `app`): The consumer.

## 1. Creating an Accessor

Create a new file in `lib/accessors/`. Extend `BaseAccessor`.

```typescript
// lib/accessors/fish.accessor.ts
import { BaseAccessor } from './base.accessor';
import { Fish, CreateFishDTO } from '@/lib/types';

export class FishAccessor extends BaseAccessor {
  constructor() {
    super(); // BaseAccessor handles Axios instance
  }

  async getAll(tankId: string): Promise<Fish[]> {
    // this.fetch is a wrapper around fetch/axios with auth headers automatically added
    return this.fetch<Fish[]>(`/tanks/${tankId}/fish`);
  }

  async create(tankId: string, data: CreateFishDTO): Promise<Fish> {
    return this.fetch<Fish>(`/tanks/${tankId}/fish`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
  }
}

// Export a singleton instance
export const fishAccessor = new FishAccessor();
```

Don't forget to export it in `lib/accessors/index.ts`.

## 2. Creating a Server Action

Create a generic action in `app/actions/`.

```typescript
// app/actions/fish.actions.ts
'use server'

import { fishAccessor } from '@/lib/accessors';
import { revalidatePath } from 'next/cache';
import { CreateFishDTO } from '@/lib/types';

export async function createFish(tankId: string, data: CreateFishDTO) {
  try {
    // 1. Call Accessor
    const newFish = await fishAccessor.create(tankId, data);
    
    // 2. Revalidate Cache (Important!)
    revalidatePath(`/tanks/${tankId}`);
    
    return { success: true, data: newFish };
  } catch (error) {
    // Error handling logic
    return { success: false, error: 'Failed to create fish' };
  }
}
```

## 3. Consuming Data

### In Server Components (Reading)
You can call the Server Action (or even the Accessor directly, though Actions are preferred for consistency) in basic async components.

```tsx
// app/tanks/[id]/page.tsx
import { fishAccessor } from '@/lib/accessors';

export default async function TankPage({ params }: { params: { id: string } }) {
  const fish = await fishAccessor.getAll(params.id);

  return <FishList fish={fish} />;
}
```

### In Client Components (Mutating)
Use Server Actions inside event handlers or `useTransition`.

```tsx
// components/fish/add-fish-form.tsx
'use client'

import { createFish } from '@/app/actions/fish.actions';

export function AddFishForm({ tankId }) {
  async function onSubmit(data) {
    const result = await createFish(tankId, data);
    if (result.success) {
      // success toast
    }
  }
  // ...
}
```

## Error Handling

*   **Accessors**: Should throw `AppError` or similar if the API returns 4xx/5xx.
*   **Actions**: Should `try/catch` and return `{ success: false, error: string }` to the UI. The UI should not crash.

## Authentication

The `BaseAccessor` automatically attaches the Bearer token to requests if a session exists on the server. You do not need to manually pass tokens to `this.fetch`.
