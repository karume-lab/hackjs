---
title: "ADR-009: Zod Validation"
description: "Schema-First Validation using Zod and drizzle-zod."
---

# ADR-009: Schema-First Validation using Zod and drizzle-zod

## Status
Accepted

## Context
Validation defines the boundaries of any system. If boundary validation is loose, malformed data slips into API endpoints, crashes clients, or corrupts databases. Defining validation manually leads to divergence: defining a type in TypeScript, creating a separate form validator class, and maintaining a distinct Database schema type constraint.

We need a unified truth mechanism where data shapes are defined once and inherited everywhere across the stack.

## Decision
We adopted **Zod** as our core validation and parsing engine, augmented by **drizzle-zod**.

- **Schema-First Types**: We define a Zod object and extract inferences (`z.infer<typeof schema>`). We use this single source of truth for all Data Transfer Objects (DTOs) in `packages/validators`.
- **drizzle-zod**: We utilize this integration to automatically map our typed SQL Database constraints defined in `packages/db` up into Zod schemas. This ensures constraints like max string lengths in SQL instantly match form validations in the UI.
- **Fullstack Pipeline**: The same exact Zod schema validates user input via `react-hook-form` in `apps/web/mobile`, validates the incoming payload inside the `packages/api` oRPC handlers, and constructs the eventual API OpenAPI definitions.

## Consequences

### Positive Outcomes
- **Runtime Safety**: TypeScript typings evaporate at runtime; Zod strictly enforces payload structures across network and process boundaries, catching malformed data synchronously.
- **Extreme DRY**: We write zero duplicated interfaces. Writing the validation logic *generates* the TS types and form configurations.
- **Forms**: Deep integration with `@hookform/resolvers/zod` turns complex multi-step UI form validations into a simple abstraction.

### Negative Outcomes / Challenges
- **Parsing Overhead**: Running `.parse()` on massive data objects introduces CPU cycles. Zod is extremely fast but is inherently slower than zero-validation typescript casts. For extreme high-velocity internal parsing, other tools may be better evaluated, but Zod dominates for user/network boundaries.
- **Client Bundle Size**: Zod isn't completely trivial on bundle size, making it a conscious trade-off for initial load times on heavily restricted client payloads. 
