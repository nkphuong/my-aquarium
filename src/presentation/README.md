# Presentation Layer

The **Presentation Layer** contains UI components and Next.js app router files. This is what users interact with.

## Structure

- **components/ui/** - shadcn/ui components and basic UI primitives
- **components/features/** - Feature-specific composed components

The Next.js `app/` directory will be moved to `src/app/` and serves as the routing/page layer.

## Rules

- Depends on application layer (calls use cases)
- No direct access to infrastructure or domain layers
- Contains React components, hooks, and Next.js pages
- Handles user interaction and presentation logic
