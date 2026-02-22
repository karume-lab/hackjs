# HACK JS

A JS based hackathon winning template.

### Core Architecture & Runtime

* **Structure:** Monorepo (Turborepo or Bun Workspaces)
* **Runtime:** Bun (Fallback to pnpm if Drizzle compatibility issues arise)
* **Package Manager:** Bun
* **Pattern:** Feature-based architecture
* **Scaffolding:** Plop.js for consistent component and feature generation

### Frameworks

* **Web App:** Next.js (App Router)
* **Web App Admin:** Next.js (App Router)
* **Mobile:** React Native (Expo)
* **Communication:** oRPC (Optimized Remote Procedure Call)

### Database & State

* **ORM:** Drizzle ORM
* **Database:** SQLite (LibSQL / Turso)
* **Server State:** TanStack Query
* **URL State:** nuqs (Type-safe search params)
* **Global State:** React Context API

### Schema & Validation

* **Validation:** Zod
* **Schema Generation:** drizzle-zod (Auto-generate Zod from DB)
* **Data Grids:** TanStack Table
* **Linting & Formatting:** Biome

### Identity & Access

* **Authentication:** Better Auth
* **Authorization:** Role-based access control (RBAC)
* **Management:** Admin Dashboard

### UI & Presentation

* **Web Components:** shadcn/ui
* **Mobile Components:** React Native Reusables
* **Icons:** Lucide (React & React Native)
* **Feedback:** Sonner (Toast notifications)
* **Marketing:** Landing Page template
* **Assets:** Dynamic OG Image generation
* **Communication:** Transactional Email templates

### Utilities

* **Date Handling:** date-fns

### Compliance & Git Workflow

* **Legal:** Privacy Policy and Terms of Service boilerplate
* **Git Hooks:** Lefthook (Pre-commit linting and type checking)

---

### Detailed Project Structure

```text
.
├── apps/
│   ├── web/                     # Next.js App Router (The "Host")
│   │   ├── src/app/             # Pages, Layouts, and API Route Handlers
│   │   │   ├── api/             # Entry points for oRPC and Better Auth
│   │   │   ├── (marketing)/     # Landing Page, Pricing, FAQ (Public)
│   │   │   ├── (dashboard)/     # Authenticated User Experience
│   │   │   └── (admin)/         # Admin Panel (RBAC protected management)
│   │   ├── src/components/      # Web-only UI (SEO, complex Nav)
│   │   └── src/features/        # Feature-folders (Pantry, Billing, etc.)
│   └── mobile/                  # React Native (The "Utility")
│       ├── src/app/             # Expo Router (File-based navigation)
│       ├── src/components/      # Mobile-only UI (QR, Native Views)
│       └── src/hooks/           # Native hooks (Push notifications, Haptics)
├── packages/
│   ├── api/                     # oRPC (The "Bridge")
│   │   ├── src/routers/         # Feature-specific API routers
│   │   └── src/client.ts        # Typed client shared by Web and Mobile
│   ├── auth/                    # Better Auth (The "Gatekeeper")
│   │   ├── src/index.ts         # Server instance config
│   │   └── src/client.ts        # Shared authentication client logic
│   ├── db/                      # Drizzle (The "Source of Truth")
│   │   ├── src/schema/          # SQLite table definitions
│   │   └── src/client.ts        # LibSQL/Turso client initialization
│   ├── ui/                      # Design System (The "Identity")
│   │   ├── src/web/             # shadcn/ui (Web primitives)
│   │   ├── src/mobile/          # RN Reusables (Mobile primitives)
│   │   └── tailwind.config.ts   # Shared brand colors, fonts, and tokens
│   └── validators/              # Zod (The "Contract")
│       └── src/index.ts         # Shared schemas for forms and DB logic
├── toolchain/
│   ├── plop/                    # Scaffolding (templates/ & plopfile.js)
│   └── lefthook/                # Git Hooks (Linting/Type-check on commit)
├── biome.json                   # Ultra-fast global lint/format rules
├── turbo.json                   # Build pipeline orchestration
└── package.json                 # Workspace root & dependency management

```

---

### Setup Guide: From Zero to ShelfLife

#### 1. Foundation & Workspace Setup

* **Initialize Directory:** Create root folder and run `bun init`.
* **Configure Workspaces:** Add `"workspaces": ["apps/*", "packages/*"]` to `package.json`.
* **Configure Turbo:** Set up `turbo.json` to cache tasks like `build`, `lint`, and `dev`.

#### 2. Core Package Development

* **`packages/db`:** Define `households` and `items` tables. Export a single database client.
* **`packages/auth`:** Initialize Better Auth with the Drizzle adapter.
* **`packages/validators`:** Use `drizzle-zod` to create an `insertItemSchema` that both apps will use for form validation.
* **`packages/ui`:** Place your base `tailwind.config.ts` here. Export shadcn for web and RN Reusables for mobile.

#### 3. API & Communication Layer

* **`packages/api`:** Define an oRPC procedure `addItem` that takes a validator from `packages/validators` and writes to `packages/db`.
* **Next.js Integration:** Create `/api/orpc/[...orpc]/route.ts` to expose the router to the mobile app.

#### 4. Frontend Implementation (ShelfLife)

* **Web Dashboard:** Use **TanStack Table** to show the pantry. Use **nuqs** so users can share filtered views (e.g., "only expired items") via the URL.
* **Admin Panel:** Use the `(admin)` route group to build a management interface for global inventory control and user moderation.
* **Mobile App:** Use **Expo Router** to create a "Log Item" screen. Use **TanStack Query** to call the oRPC `addItem` procedure.

#### 5. Deployment

* **Infrastructure:** Provision a **Turso** database (SQLite at the edge). Deploy the Next.js app to **Vercel**. Deploy the mobile app to **EAS**.

---

### Sample Project: ShelfLife (Inventory & Expiry Tracker)

ShelfLife is a real-time inventory and expiration tracking system designed to reduce household waste. It bridges the gap between point-of-purchase logging on mobile and household management oversight on the web.

#### How It Works

* **Mobile Logging (Expo):** Users log items and expiry dates via **RN Reusables**.
* **Visual Dashboard (Next.js):** A color-coded grid powered by **TanStack Table** highlights urgent items.
* **Shared Household (Better Auth):** Roommates stay in sync via a shared database.
* **Smart Filtering (nuqs):** Admins search through inventory instantly via URL-based state.

#### Technical Highlights

* **Type-Safe Sync:** Shared `ItemSchema` in `packages/validators`.
* **Efficient API:** **oRPC** provides zero-overhead type safety between Expo and Next.js.
* **Real-Time Feedback:** **TanStack Query** invalidates the "Pantry List" across all devices when an item is added.

---

### Implementation Priority

1. **Initialize Monorepo:** Set up shared `packages/db` and `packages/auth`.
2. **Define Shared Schemas:** Ensure web and mobile apps stay in sync via `packages/validators`.
3. **Configure oRPC:** Link the Next.js backend to the React Native frontend.
4. **UI Scaffolding:** Integrate shadcn, RN Reusables, and Lucide.
