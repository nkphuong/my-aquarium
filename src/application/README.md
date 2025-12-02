# Application Layer

The **Application Layer** orchestrates the flow of data between the domain and external layers. It contains use cases and application-specific business rules.

## Structure

- **use-cases/** - Application use cases/interactors (e.g., CreateUser, GetProducts)
- **dtos/** - Data Transfer Objects for input/output
- **ports/** - Interfaces for external services (implementations in infrastructure)

## Rules

- Depends only on the domain layer
- Orchestrates domain objects to fulfill use cases
- No UI or database implementation details
- Defines ports (interfaces) for external dependencies
