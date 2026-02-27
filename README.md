# HackJS

A fullstack JavaScript/TypeScript monorepo template for rapidly building Web and Mobile MVPs using modern tools. It bridges Next.js on the web and React Native (Expo) on mobile, connected via end-to-end type-safe RPC (oRPC).

> [!NOTE]
> This template is designed for **MVPs and prototyping** — it prioritizes developer velocity over production-grade hardening. Use it as a starting point to validate ideas quickly, then harden as needed.

## Core Stack

- **Monorepo:** Turborepo & Bun Workspaces — Efficient management of shared packages and apps with high-performance dependency resolution.
- **Web App:** Next.js (App Router) — Modern React framework optimized for performance, SEO, and developer productivity.
- **Mobile App:** React Native (Expo Router) — Native mobile development with shared logic and file-based routing.
- **Database & ORM:** Drizzle ORM + SQLite (LibSQL/Turso) — Lightweight, edge-ready database with a type-safe, developer-friendly ORM.
- **Authentication:** Better Auth — A comprehensive authentication framework designed for safety and ease of integration.
- **Communication:** oRPC — Optimized Remote Procedure Call for seamless, end-to-end type safety between services.
- **State Management:** TanStack Query & nuqs — Robust server-state synchronization and type-safe URL search params.
- **Validation:** Zod & drizzle-zod — Schema-first validation for runtime safety and database schema inference.
- **UI & Styling:** Tailwind CSS & shadcn/ui — Utility-first styling with high-quality, accessible component primitives for Web and Mobile.
- **Linting & Formatting:** Biome — Ultra-fast, unified toolchain for maintaining code quality and consistent formatting.

## Project Structure

```text
.
├── apps/
│   ├── web/                     # Next.js App Router (Web Dashboard & API)
│   └── mobile/                  # React Native / Expo (Mobile Client)
├── packages/
│   ├── api/                     # oRPC (The Bridge between Web & Mobile)
│   ├── auth/                    # Better Auth (Authentication Gatekeeper)
│   ├── db/                      # Drizzle ORM (Database connection & schema)
│   ├── ui/                      # Shared design system & Tailwind configuration
│   └── validators/              # Shared Zod schemas for forms and types
└── package.json                 # Workspace root & scripts
```

## Setup

### Prerequisites
- [Bun](https://bun.sh/) (latest version)
- Node.js (v20+ recommended)
- A Database URL (e.g., local SQLite, or Turso)

### 1. Installation

```bash
git clone https://github.com/karume-lab/hackjs.git
cd hackjs
bun install
```

### 2. Environment Variables

Create an `.env` file in `apps/web` with your credentials:

```env
DATABASE_URL="file:../../local.db"
BETTER_AUTH_SECRET=your-random-auth-secret
```

### 3. Database Migration

Push your schema to the database:

```bash
bun turbo run db:push --filter=@repo/db
```

## Usage

### Development

Start all dev servers (Next.js + Expo) in parallel:

```bash
bun dev
```

Or run individually:

```bash
# Web only
bun turbo run dev --filter=web

# Mobile only
bun start

# Android emulator/device
bun android

# iOS simulator
bun ios
```

### Production Build

```bash
bun build
```

### Code Quality

```bash
# Format the entire workspace
bun format

# Run linter
bun lint
```

## Workflow
 
### Adding UI Components
 
We provide unified scripts at the root to add components from their respective registries:
 
```bash
# Web (shadcn/ui)
bun ui:web [component-name]
 
# Mobile (react-native-reusables)
bun ui:mobile [component-name]
```
 
### Package Management
 
Manage dependencies across the monorepo from the root:
 
#### 1. Global Development Tools
For tools that apply to the entire workspace (e.g., `turbo`, `biome`).
```bash
bun add -d [package]
```
 
#### 2. App-Specific Dependencies
To install a package only for the Web or Mobile application.
```bash
# Web
bun add [package] --filter web
 
# Mobile
bun add [package] --filter mobile
```
 
#### 3. Shared Package Dependencies
To install a package for a shared library (e.g., `db`, `api`).
```bash
bun add [package] --filter @repo/db
bun add [package] --filter @repo/api
```
 
## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes
3. Open a Pull Request
