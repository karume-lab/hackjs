# HackJS

<p align="center">
  <img src="packages/assets/logo.png" alt="HackJS Logo" width="200" />
  <br />
  <em>This is an image of a hacksaw</em>
</p>

A fullstack JavaScript/TypeScript monorepo template for rapidly building Web and Mobile MVPs using modern tools. It bridges Next.js on the web and React Native (Expo) on mobile, connected via end-to-end type-safe RPC (oRPC).

> [!NOTE]
> This template is designed for **MVPs and prototyping** — it prioritizes developer velocity over production-grade hardening. Use it as a starting point to validate ideas quickly, then harden as needed.
>
> For those seeking a more comprehensive and production-hardened template, consider <a href="https://www.better-t-stack.dev/" target="_blank" rel="noopener noreferrer">Better T-Stack</a>.

## Quick Start Tutorial

Learn how to build with HackJS by following the <a href="https://code2tutorial.com/tutorial/926b939b-24c9-487a-a3f9-359877d46087/index.md" target="_blank" rel="noopener noreferrer">Quick Start Tutorial</a>.

## Core Stack

- **Monorepo:** Turborepo & Bun Workspaces — Efficient management of shared packages and apps with high-performance dependency resolution.
- **Web App:** Next.js (App Router) — Modern React framework optimized for performance, SEO, and developer productivity.
- **Mobile App:** React Native (Expo Router) — Native mobile development with shared logic and file-based routing.
- **Database & ORM:** Drizzle ORM + SQLite — Lightweight, local-first database with a type-safe, developer-friendly ORM.
- **Authentication:** Better Auth — A comprehensive authentication framework designed for safety and ease of integration.
- **Communication:** oRPC — Optimized Remote Procedure Call for seamless, end-to-end type safety between services.
- **API Documentation:** OpenAPI & Scalar — Automatically generated API schema and a beautiful developer-friendly reference UI.
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
- ADB (for Android development)

### 1. Installation

```bash
git clone https://github.com/karume-lab/HackJS.git
cd HackJS
bun install
```

### 2. Environment Variables

Each app and package may require environment variables. Copy the `.env.example` files to `.env` in the following locations:

- `.env`
- `apps/web/.env`
- `apps/mobile/.env`

### 3. Database Initialization

Push your schema to the database and start the database studio:

```bash
# Push schema changes
bun --cwd packages/db db:push

# Open Drizzle Studio to inspect data
bun --cwd packages/db db:studio
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

### API Documentation

The API documentation is automatically generated from your oRPC procedures. HackJS uses Fumadocs for a beautiful, interactive documentation experience.

- **OpenAPI Schema:** `http://localhost:3000/api/openapi.json`
- **Interactive Reference:** `http://localhost:3000/docs/api/reference`

## Documentation & ADRs

HackJS maintains Architecture Decision Records (ADRs) to document key technical decisions. These can be found in the `/docs` directory:

- [ADR 001: oRPC for Type Safety](docs/adr-001-orpc.md)
- [ADR 002: Better Auth](docs/adr-002-better-auth.md)
- [ADR 003: Drizzle ORM](docs/adr-003-drizzle-orm.md)
- [ADR 004: Turborepo & Bun](docs/adr-004-turborepo-bun.md)
- [ADR 005: Next.js App Router](docs/adr-005-nextjs.md)
- [ADR 006: Expo Router](docs/adr-006-expo-router.md)
- [ADR 007: Scalar & OpenAPI](docs/adr-007-scalar-openapi.md)
- [ADR 008: State Management](docs/adr-008-state-management.md)
- [ADR 009: Zod Validation](docs/adr-009-zod-validation.md)
- [ADR 010: UI Architecture](docs/adr-010-tailwind-shadcn.md)
- [ADR 011: Biome](docs/adr-011-biome.md)

Explore the `/docs` folder for more detailed architectural insights.

### Adding New Features

#### New API Procedure
1. Define your Zod schema in `packages/validators`.
2. Implement the procedure in `packages/api/src/routers/`.
3. The type-safe client will be automatically available to both `web` and `mobile`.

#### New UI Component
```bash
# Web (shadcn/ui)
bun ui:web [component-name]

# Mobile (react-native-reusables)
bun ui:mobile [component-name]
```

### Code Quality

```bash
# Format and lint fix the entire workspace
bun clean

# Run linter checks
bun lint
```

## Deployment

### Web (Next.js)
Deploy to [Vercel](https://vercel.com/) by connecting your repository. Ensure you set all environment variables in the Vercel dashboard.

### Mobile (React Native)
Use [Expo Application Services (EAS)](https://expo.dev/eas) for builds and submissions:

```bash
# Login to Expo
bunx eas login

# Build for Android
bunx eas build -p android

# Build for iOS
bunx eas build -p ios
```

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before getting started.

1.  **Create a Branch**: Create a new branch for your changes (`git checkout -b feature/[FEATURE_NAME]`).
2.  **Make Changes**: Implement your changes and ensure they follow the project's coding standards.
3.  **Run Tests**: Ensure all tests pass (`bun lint` and `bun typecheck`).
4.  **Submit a Pull Request**: Submit a pull request to the main repository.

---

Thank you for your interest in HackJS and remember to star the repo!
