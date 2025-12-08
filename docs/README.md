# Documentation

This folder contains comprehensive documentation for the AquaCare aquarium management system.

## Available Documentation

### Architecture & Setup

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed clean architecture implementation guide
  - Domain-Driven Design (DDD) principles
  - Layer-by-layer examples
  - Complete feature implementation walkthrough

- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Project setup completion checklist
  - Initial configuration steps
  - Technology stack overview

### Backend Integration

- **[NESTJS_INTEGRATION.md](./NESTJS_INTEGRATION.md)** - NestJS + Supabase integration guide
  - Backend API setup
  - Database configuration
  - Authentication endpoints
  - Example implementations

### Technical Implementation

For implementation-specific documentation, see:

- **Authentication**: `src/infrastructure/auth/` - NextAuth.js configuration
- **Dependency Injection**: `src/infrastructure/di/README.md` - TSyringe DI container guide
- **Main Project Guide**: `CLAUDE.md` (project root) - Quick reference for Claude Code

## Project Structure

```
my-aquarium/
├── docs/                    # 📚 This folder - All documentation
├── src/                     # 🏗️ Business logic (framework-independent)
│   ├── domain/             # Core business rules
│   ├── application/        # Use cases
│   └── infrastructure/     # External implementations
├── app/                     # ⚡ Next.js App Router (framework layer)
├── components/              # 🎨 UI components (shadcn/ui)
└── CLAUDE.md               # 🤖 Quick reference guide
```

## Quick Links

- [Main README](../README.md) - Project overview and getting started
- [CLAUDE.md](../CLAUDE.md) - Development guidelines for AI assistance
- [DI Documentation](../src/infrastructure/di/README.md) - Dependency injection guide
