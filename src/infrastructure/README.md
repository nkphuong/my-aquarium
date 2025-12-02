# Infrastructure Layer

The **Infrastructure Layer** contains implementations of interfaces defined in domain and application layers. This is where framework-specific code lives.

## Structure

- **persistence/** - Database implementations, ORMs, repository implementations
- **external-services/** - Third-party API clients, external integrations
- **adapters/** - Adapters for converting between domain objects and external formats

## Rules

- Implements repository interfaces from domain layer
- Implements port interfaces from application layer
- Contains framework-specific code (Prisma, Axios, etc.)
- Depends on domain and application layers
