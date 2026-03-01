---
title: "ADR-003: Drizzle ORM"
description: "Database Interactions via Drizzle ORM."
---

# ADR-003: Database Interactions via Drizzle ORM

## Status
Accepted

## Context
With a strictly typed monorepo sharing code between APIs, a Next.js frontend, and a React Native mobile app, ensuring the database schema is intrinsically linked to the TypeScript type system is a priority. We require a data access layer that is deeply typed, performant, and supports edge deployments or serverless functions if our infrastructure evolves.

We evaluated Prisma and Drizzle ORM. Prisma provides an excellent DX but relies on a proprietary Rust-based query engine which can introduce deployment complications on edge runtimes and increases cold start times. 

## Decision
We chose **Drizzle ORM** for our core database layer (\`packages/db\`).

- **SQL-like Syntax**: Drizzle allows developers to write queries that closely resemble SQL, preventing the "N+1" abstraction problems sometimes caused by heavy ORMs.
- **Zero Dependencies**: Drizzle operates without a heavy sidecar/engine. It's essentially a lightweight query builder with strict types.
- **Schema as TypeScript**: Unlike Prisma's \`.prisma\` files, Drizzle schemas are pure TypeScript. This allows us to export Drizzle's inferred types directly into \`packages/validators\` or use them within \`packages/api\` oRPC routers natively.

## Consequences

### Positive Outcomes
- **Edge Ready**: Without a heavy Rust binary, deploying our Next.js API routes or oRPC handlers to edge workers (Cloudflare, Vercel Edge) is seamless.
- **Type Inference**: Drizzle's tight integration with Zod (via \`drizzle-zod\`) means we can generate our \`packages/validators\` directly from the database schema, ensuring a single source of truth from Database -> API -> Client.
- **Performance**: The lack of a middle-man query engine results in lower latency and faster cold starts.

### Negative Outcomes / Challenges
- **Migration Management**: Drizzle's migration system requires more manual oversight compared to Prisma's automated workflow.
- **Verbosity**: Highly complex queries might require writing more explicit boilerplate than Prisma's highly abstracted relational queries.
