# Project Documentation

Welcome to the **Aquarium Companion** documentation. This project uses a **Flat IDesign** architecture optimized for Next.js App Router.

## 📚 Core Guides

*   **[Architecture Guide](docs/ARCHITECTURE.md)**
    *   Learn about the "Flat IDesign" pattern (Lib/Accessors layer, App/Actions layer).
    *   Understand the "Single Source of Truth" for types.
    *   See how data flows from Server Components -> Actions -> Accessors -> API.

*   **[API & Data Access Guide](docs/API_GUIDE.md)**
    *   How to fetch data using **Accessors**.
    *   How to mutate data using **Server Actions**.
    *   Reference for `BaseAccessor` and Error Handling.

*   **[Design System](docs/DESIGN_SYSTEM.md)**
    *   UI Components (Shadcn/UI), Colors, Typography.
    *   Tailwind CSS usage guidelines.
    *   **[Dashboard Styling](docs/DASHBOARD_STYLING.md)** (Pastel Theme).

## 🚀 Setup & Deployment

*   **[Setup Guide](docs/SETUP_COMPLETE.md)** (Updated reference coming soon)
    *   Environment variables.
    *   Running locally.

## 🛠 Project Structure

```
.
├── app/               # Next.js App Router (Pages, Layouts, Server Actions)
├── components/        # React Components (UI & Features)
├── lib/               # Core Logic (The "Brain")
│   ├── accessors/     # Data Access Layer (API calls)
│   ├── api/           # Base HTTP Client
│   ├── auth/          # Authentication Logic
│   └── types/         # Single Source of Truth for Types
├── hooks/             # Custom React Hooks
└── docs/              # Detailed Documentation
```
