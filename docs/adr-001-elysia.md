---
title: "ADR-001: Elysia for Type Safety"
description: "Adopting Elysia and Eden Treaty as the primary API layer for end-to-end type safety."
---

# ADR-001: Adopting Elysia for End-to-End Type Safety

## Status
Accepted

## Context
In our Fullstack JS Monorepo utilizing Turborepo, we operate multiple thin clients, specifically a Next.js App Router (`apps/web`) and an Expo React Native application (`apps/mobile`). As our business logic scales, maintaining type definitions and API contracts manually across the server and multiple clients leads to increased mental overhead, duplication of types, and painful out-of-sync runtime errors.

We evaluated several end-to-end type-safe API solutions. Initially, oRPC was considered, but we decided to move to **Elysia** for its Bun-native performance, excellent developer experience with Eden Treaty, and built-in support for standard web APIs and OpenAPI via Swagger. Elysia provides a seamless way to share types between the server and any TypeScript-based client without complex build steps.

## Decision
We will use **Elysia** as the primary API framework (`packages/api`) to construct our server routers and expose them to our clients via **Eden Treaty**.

- **Single Source of Truth**: `packages/api` will import validators from `packages/validators` and query `packages/db`.
- **Eden Treaty**: Both `apps/web` and `apps/mobile` will consume the API using `@elysiajs/eden`, providing end-to-end type safety and IDE auto-completion.
- **TanStack Query**: We will wrap Eden Treaty calls in TanStack Query hooks for robust state management and caching.
- **OpenAPI/Swagger**: The Elysia app will automatically generate an OpenAPI specification using the `@elysiajs/swagger` plugin, facilitating documentation and external consumption.

## Consequences
### Positive Outcomes
- **Zero-Duplication**: Automatic type sharing between backend and multiple frontends.
- **High Performance**: Native performance on Bun.
- **Standardized API**: Native support for Fetch API standards and easy OpenAPI generation.
- **Fail-Fast**: TypeScript will catch breaking API changes across the monorepo at build time.

### Negative Outcomes / Challenges
- **Ecosystem Maturity**: While fast-growing, Elysia is newer than some alternatives like tRPC. 
- **Tooling Specifics**: Requires understanding of Eden Treaty's proxy-based client.
