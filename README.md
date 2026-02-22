# HackJS

A high-performance, feature-based Turborepo monorepo template for building robust Web and Mobile applications using modern JS/TS tools. It bridges the gap between Next.js on the web and React Native (Expo) on mobile, connected via an optimized end-to-end type-safe RPC (oRPC).

## What is HackJS?

HackJS is a hackathon-winning monorepo template designed for maximum developer velocity without compromising on architecture. It provides a highly optimized starting point for projects requiring both a Web Admin/Dashboard and a Mobile Application with shared business logic, database schemas, and validation rules.

### Core Stack
- **Monorepo:** Turborepo & Bun Workspaces
- **Web App:** Next.js (App Router)
- **Mobile App:** React Native (Expo Router)
- **Database & ORM:** Drizzle ORM + SQLite (LibSQL/Turso)
- **Authentication:** Better Auth
- **Communication:** oRPC (Optimized Remote Procedure Call)
- **State Management:** TanStack Query, React Context, & nuqs
- **Validation:** Zod & drizzle-zod
- **UI & Styling:** Tailwind CSS, shadcn/ui (Web), RN Reusables (Mobile)
- **Linting & Formatting:** Biome

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

## Setup Instructions

### Prerequisites
- [Bun](https://bun.sh/) (latest version)
- Node.js (v20+ recommended)
- A Database URL (e.g., local SQLite, or Turso)

### 1. Installation

Clone the repository and install dependencies at the root level using Bun:

```bash
git clone https://github.com/karume-lab/hackjs.git
cd hackjs
bun install
```

### 2. Environment Variables

Create an `.env` file in the root directory (or specific apps/packages like `apps/web`) with your required credentials. Based on the tools used, you will likely need:

```env
DATABASE_URL=libsql://your-turso-db-url.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token
BETTER_AUTH_SECRET=your-random-auth-secret
```

### 3. Database Migration

Push your schema directly to your database using Drizzle (assuming `db:push` exists in the db package):

```bash
bun run turbo run db:push --filter=@repo/db
```

## How to Use

HackJS uses Turborepo to efficiently run tasks across the monorepo from the root directory.

### Running the Development Servers

To start all development servers (Next.js and Expo) in parallel:

```bash
bun run dev
```

### Running Apps Individually

If you only want to run specific apps without starting the rest of the workspace:

**Web App (Next.js):**
```bash
bun run turbo run dev --filter=web
```

**Mobile App (Expo):**
Using the convenience scripts added to the root `package.json`:
```bash
# Start the Expo bundler
bun run start

# Run directly on an Android emulator/device
bun run android

# Run directly on an iOS simulator
bun run ios
```
*(Or use `bun run turbo run dev --filter=mobile`)*

### Building for Production

To build all apps and packages in the workspace:
```bash
bun run build
```

### Code Quality

We use Biome to ensure high code quality and fast formatting.

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

*Note: This repository is configured to use Git hooks to automatically run Biome formatting and linting on commit.*
