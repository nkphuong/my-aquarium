# My Aquarium

A Next.js 16 application built with **DDD (Domain-Driven Design)** and **Hexagonal Architecture** principles.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start

# Lint code
pnpm lint
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Architecture

This project follows **Clean Architecture** principles using DDD and Hexagonal Architecture patterns.

### Project Structure

```
src/
├── app/                    # Next.js App Router (Presentation)
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
│
├── domain/                # Domain Layer (Core Business Logic)
│   ├── entities/         # Business entities with identity
│   ├── value-objects/    # Immutable value objects
│   ├── repositories/     # Repository interfaces
│   └── services/         # Domain services
│
├── application/          # Application Layer (Use Cases)
│   ├── use-cases/       # Business use cases
│   ├── dtos/            # Data Transfer Objects
│   └── ports/           # Interfaces for external services
│
├── infrastructure/       # Infrastructure Layer (External Concerns)
│   ├── persistence/     # Database implementations
│   ├── external-services/ # Third-party API clients
│   └── adapters/        # Data converters
│
├── presentation/        # Presentation Layer (UI)
│   ├── components/
│   │   ├── ui/         # shadcn/ui primitives
│   │   └── features/   # Feature-specific components
│   └── hooks/          # Custom React hooks
│
└── lib/                # Shared utilities
    └── utils.ts        # cn() and other helpers
```

### Dependency Flow

```
Presentation → Application → Domain
                     ↑
Infrastructure ------┘
```

- **Domain Layer**: Pure business logic, no dependencies
- **Application Layer**: Orchestrates use cases, depends on Domain
- **Infrastructure Layer**: Implements interfaces from Domain/Application
- **Presentation Layer**: UI components, depends on Application

### Key Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Inversion**: Outer layers depend on inner layers
3. **Framework Independence**: Core business logic is framework-agnostic
4. **Testability**: Easy to test each layer in isolation
5. **Flexibility**: Easy to swap implementations (e.g., change database)

## Path Aliases

TypeScript path aliases for cleaner imports:

```typescript
import { User } from '@/domain/entities/user'
import { CreateUserUseCase } from '@/application/use-cases/create-user'
import { Button } from '@/presentation/components/ui/button'
import { cn } from '@/lib/utils'
```

Available aliases:
- `@/*` → `src/*`
- `@/domain/*` → `src/domain/*`
- `@/application/*` → `src/application/*`
- `@/infrastructure/*` → `src/infrastructure/*`
- `@/presentation/*` → `src/presentation/*`

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - Claude Code integration guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture guide with examples
- **[.github/architecture-diagram.md](.github/architecture-diagram.md)** - Visual architecture diagram
- **[.github/FEATURE_TEMPLATE.md](.github/FEATURE_TEMPLATE.md)** - Template for new features

## Adding New Features

See [.github/FEATURE_TEMPLATE.md](.github/FEATURE_TEMPLATE.md) for a step-by-step guide on implementing new features following the architecture.

Quick summary:
1. Start with **Domain Layer** (entities, value objects, repository interfaces)
2. Add **Application Layer** (use cases, DTOs)
3. Implement **Infrastructure Layer** (repositories, external services)
4. Build **Presentation Layer** (components, pages, server actions)

## Example Code

The project includes example implementations to demonstrate the architecture:

- [src/domain/entities/example.entity.ts](src/domain/entities/example.entity.ts)
- [src/domain/value-objects/example.value-object.ts](src/domain/value-objects/example.value-object.ts)
- [src/application/use-cases/example.use-case.ts](src/application/use-cases/example.use-case.ts)
- [src/infrastructure/persistence/in-memory-example.repository.ts](src/infrastructure/persistence/in-memory-example.repository.ts)

## shadcn/ui

This project uses shadcn/ui for UI components. Add new components:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
```

Components will be added to `src/presentation/components/ui/`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
