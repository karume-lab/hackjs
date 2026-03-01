---
title: "ADR-004: Turborepo & Bun"
description: "Monorepo Management with Turborepo and Bun."
---

# ADR-004: Monorepo Management with Turborepo and Bun

## Status
Accepted

## Context
When building a Fullstack system that includes an API, Web Application, Mobile Application, and numerous shared internal packages (UI, DB, Auth, Validators), a standard multi-repo architecture leads to versioning drift, duplicated dependency installations, and complex CI/CD pipelines.

We need a monorepo toolchain that can understand a dependency graph locally, cache build outputs to eliminate redundant work, and drastically speed up the feedback loop. 

## Decision
We elected to use **Turborepo** in combination with **Bun Workspaces**.

- **Turborepo**: Manages our execution pipelines. It understands the topological graph of our workspace (e.g., `apps/web` depends on `packages/ui` and `packages/api`) and ensures that tasks like `build`, `lint`, and `typecheck` are run in the correct order. The remote caching capabilities further reduce CI times significantly.
- **Bun**: Rather than using `npm`, `yarn`, or `pnpm`, we use Bun for package management and script execution. Bun's native workspace support pairs perfectly with Turborepo. It replaces Node.js entirely for our local development tooling, providing near-instant dependency resolution and installation times. 

## Consequences

### Positive Outcomes
- **Unrivaled Local Performance**: Bun `install` takes milliseconds, drastically improving developer experience compared to older Node package managers.
- **Incremental Builds**: Turborepo caches output logs and build artifacts. If a user only changes code in `apps/mobile`, the `apps/web` build will hit a cache rather than rebuilding from scratch.
- **Simplified Tooling**: No need for complex `lerna` configurations. Everything relies on standard `package.json` workspaces.

### Negative Outcomes / Challenges
- **Bun Ecosystem Maturity**: While Bun is incredibly fast, some legacy node plugins or very specific build steps may have edge-case incompatibilities requiring workarounds.
