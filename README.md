# HackJS

A fullstack JavaScript/TypeScript monorepo template for rapidly building Web and Mobile MVPs using modern tools. It bridges Next.js on the web and React Native (Expo) on mobile, connected via end-to-end type-safe RPC (oRPC).

> [!NOTE]
> This template is designed for **MVPs and prototyping** — it prioritizes developer velocity over production-grade hardening. Use it as a starting point to validate ideas quickly, then harden as needed.

## Core Stack

- **Monorepo:** Turborepo & Bun Workspaces — Efficient management of shared packages and apps with high-performance dependency resolution.
- **Web App:** Next.js (App Router) — Modern React framework optimized for performance, SEO, and developer productivity.
- **Mobile App:** React Native (Expo Router) — Native mobile development with shared logic and file-based routing.
- **Database & ORM:** Drizzle ORM + SQLite — Lightweight, local-first database with a type-safe, developer-friendly ORM.
- **Authentication:** Better Auth — A comprehensive authentication framework designed for safety and ease of integration.
- **Communication:** oRPC — Optimized Remote Procedure Call for seamless, end-to-end type safety between services.
- **State Management:** TanStack Query & nuqs — Robust server-state synchronization and type-safe URL search params.
- **Validation:** Zod & drizzle-zod — Schema-first validation for runtime safety and database schema inference.
- **UI & Styling:** Tailwind CSS & shadcn/ui — Utility-first styling with high-quality, accessible component primitives.
- **Linting & Formatting:** Biome — Ultra-fast, unified toolchain for maintaining code quality and consistent formatting.

## Project Structure

```text
.
├── apps/
│   ├── web/                     # Next.js App Router (Dashboard & API)
│   └── mobile/                  # React Native / Expo (Native Client)
├── packages/
│   ├── api/                     # oRPC (End-to-end type-safety bridge)
│   ├── auth/                    # Better Auth (Authentication logic)
│   ├── db/                      # Drizzle ORM + SQLite (Database layer)
│   ├── types/                   # Shared TypeScript interfaces
│   ├── ui/                      # Shared UI system (Tailwind & Components)
│   ├── validators/              # Common Zod schemas
│   ├── utils/                   # Shared helper functions
│   └── assets/                  # Shared images and icons
└── package.json                 # Monorepo root & scripts
```

## Setup

### Prerequisites
- [Bun](https://bun.sh/) (latest version)
- Node.js (v20+ recommended)
- ADB

### 1. Installation

```bash
git clone https://github.com/karume-lab/hackjs.git
cd hackjs
bun install
```

### 2. Environment Variables

For every `.env.example` file in the project, copy it to a `.env` file and edit as needed:

```bash
# Example for the Web app
cp apps/web/.env.example apps/web/.env
```

### 3. Database Migration

Push your schema to the database:

```bash
bun --cwd packages/db db:push
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
bun --cwd apps/web dev

# Mobile (Expo development server)
bun start

# Android emulator/device
bun android

# iOS simulator
bun ios
```

### UI Component Management

Add components to your workspace using unified scripts:

```bash
# Web (shadcn/ui)
bun ui:web [component-name]

# Mobile (react-native-reusables)
bun ui:mobile [component-name]
```

### Code Quality

```bash
# Format the entire workspace
bun clean

# Run linter
bun lint
```

## Package Management

Manage dependencies across the monorepo from the root:

```bash
# Add a dependency to a specific package/app
bun add [package] --filter @repo/db
bun add [package] --filter web
bun add [package] --filter mobile

# Add a dev dependency globally
bun add -d [package]
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes
3. Open a Pull Request
