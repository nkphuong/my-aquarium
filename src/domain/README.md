# Domain Layer

The **Domain Layer** contains the core business logic and rules. It is independent of any external concerns (UI, database, frameworks).

## Structure

- **entities/** - Core business objects with identity (e.g., User, Product, Order)
- **value-objects/** - Immutable objects defined by their attributes (e.g., Email, Money, Address)
- **repositories/** - Interfaces for data persistence (implementation in infrastructure layer)
- **services/** - Domain services that don't naturally fit into entities

## Rules

- No dependencies on other layers
- Pure TypeScript/JavaScript - no framework dependencies
- Contains business rules and domain logic
- Defines repository interfaces, not implementations
