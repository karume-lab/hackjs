# HackJS

A fullstack JavaScript/TypeScript monorepo template for rapidly building Web and Mobile MVPs using modern tools. It bridges Next.js on the web and React Native (Expo) on mobile, connected via end-to-end type-safe RPC (oRPC).

> [!NOTE]
> This template is designed for **MVPs and prototyping** — it prioritizes developer velocity over production-grade hardening. Use it as a starting point to validate ideas quickly, then harden as needed.

## Core Stack

- **Monorepo:** Turborepo & Bun Workspaces -> ease of management and code sharing
- **Web App:** Next.js (App Router) -> ai knows this best, 
- **Mobile App:** React Native (Expo Router) -> Javascript, cross platform
- **Database & ORM:** Drizzle ORM + SQLite (LibSQL/Turso) -> fast and len
- **Authentication:** Better Auth -> better auth
- **Communication:** oRPC (Optimized Remote Procedure Call) -> FULL type safety, and i mean end to end
- **State Management:** TanStack Query, React Context, & nuqs
- **Validation:** Zod & drizzle-zod
- **UI & Styling:** Tailwind CSS, shadcn/ui (Web), RN Reusables (Mobile) ->  you can never go wrong with this
- **Linting & Formatting:** Biome -> minimal config, max performance

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
DATABASE_URL=libsql://your-turso-db-url.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token
BETTER_AUTH_SECRET=your-random-auth-secret
```

### 3. Database Migration

Push your schema to the database:

```bash
bun run turbo run db:push --filter=@repo/db
```

## Usage

### Development

Start all dev servers (Next.js + Expo) in parallel:

```bash
bun run dev
```

Or run individually:

```bash
# Web only
bun run turbo run dev --filter=web

# Mobile only
bun run start

# Android emulator/device
bun run android

# iOS simulator
bun run ios
```

### Production Build

```bash
bun run build
```

### Code Quality

```bash
# Format the entire workspace
bun run format

# Run linter
bun run lint
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes
3. Open a Pull Request
