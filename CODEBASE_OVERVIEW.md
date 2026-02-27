# Repository Overview: Taskly Monorepo

Welcome to the **Taskly** monorepo. This project is a modern, high-performance full-stack application built using a unified **TypeScript** toolchain. It leverages **Turborepo** for build orchestration and **Bun** as the primary runtime and package manager.

## 🏗️ High-Level Architecture

The repository follows a **Monorepo** pattern, separating concerns into `apps` (user-facing applications) and `packages` (shared logic, UI, and infrastructure).

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Build Orchestration**: [Turborepo](https://turbo.build/)
- **Monorepo Strategy**: Shared workspace packages via `package.json` workspaces.
- **Styling**: Tailwind CSS 4+ (using `@rn-primitives` for mobile/web cross-compatibility).
- **Communication**: Type-safe API via [oRPC](https://orpc.sh/).

---

## 📁 Directory Structure

### 📂 Root Directory
The root contains workspace-wide configuration and metadata.

| File/Folder | Role |
| :--- | :--- |
| `apps/` | Contains the deployable applications (Web, Mobile). |
| `packages/` | Core shared libraries and logic used by the apps. |
| `toolchain/` | Shared build tools and environment configurations. |
| `package.json` | Workspace root definition, shared devDependencies, and global scripts (`dev`, `build`, `lint`). |
| `turbo.json` | Turborepo configuration defining task pipelines and cache outputs. |
| `tsconfig.json` | Base TypeScript configuration with path aliases for all `@repo/*` packages. |
| `biome.json` | Configuration for [Biome](https://biomejs.dev/), used for fast linting and formatting. |
| `bunfig.toml` | Bun-specific runtime configuration. |
| `lefthook.yml` | Git hooks manager (e.g., pre-commit linting). |
| `local.db` | Local SQLite database file (used by Drizzle). |
| `.env.example` | Template for environment variables. |
| `TODO.md` | Roadmap and pending tasks for the project. |

---

### 📂 `apps/`
User-facing entry points.

#### 🌐 `apps/web`
A **Next.js 16** application.
- `src/app/`: Next.js App Router (pages, layouts).
- `src/components/`: Web-specific UI components.
- `src/proxy.ts`: oRPC proxy setup for server-side communication.
- `next.config.ts`: Next.js specific configuration.

#### 📱 `apps/mobile`
An **Expo (React Native)** application.
- `src/app/`: Expo Router (file-based routing for mobile).
- `src/components/`: Mobile-specific UI components.
- `src/lib/`: Native-specific utility functions.
- `app.json`: Expo project configuration.
- `metro.config.js`: React Native bundler configuration.

---

### 📂 `packages/`
Shared libraries prefixed with `@repo/`.

| Package | Role |
| :--- | :--- |
| `api/` | The central API definition using **oRPC**. Defines routers and procedures shared between Web and Mobile. |
| `auth/` | Authentication logic powered by **Better Auth**. |
| `db/` | Database layer using **Drizzle ORM**. Contains schema definitions, migrations, and the SQLite client. |
| `ui/` | **The Design System**. Shared UI components split into `web/` and `mobile/` using a unified aesthetic. Uses `shadcn` patterns. |
| `types/` | Shared TypeScript interfaces and types. |
| `validators/` | Shared **Zod** schemas for data validation (used by both API and Forms). |
| `utils/` | Common helper functions (formatting, date logic, etc.). |
| `assets/` | Shared static assets (images, icons). |

---

## 🛠️ Key Workflows

### 💻 Development
To start the entire environment (API, Web, and Mobile watch mode):
```bash
bun dev
```

### 🗄️ Database
Managed within `packages/db`.
- **Generate Migration**: `bun x drizzle-kit generate`
- **Push Schema**: `bun x drizzle-kit push`
- **Studio (GUI)**: `bun x drizzle-kit studio`

### 🧹 Linting & Formatting
Handled by Biome for near-instant execution:
```bash
bun lint
```

---

## 🧩 Shared Logic "Secret Sauce"
The `tsconfig.json` at the root uses **Path Aliases** to allow apps to import packages directly from source during development without needing a build step:

```json
"@repo/db": ["./packages/db/src/index.ts"],
"@repo/api": ["./packages/api/src/index.ts"],
...
```
This ensures a seamless DX (Developer Experience) with instant feedback across the entire stack.
