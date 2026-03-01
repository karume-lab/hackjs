---
title: "ADR-001: oRPC for Type Safety"
description: "Adopting oRPC as the primary API layer for end-to-end type safety."
---

# ADR-001: Adopting oRPC for End-to-End Type Safety

## Status
Accepted

## Context
In our Fullstack JS Monorepo utilizing Turborepo, we operate multiple thin clients, specifically a Next.js App Router (\`apps/web\`) and an Expo React Native application (\`apps/mobile\`). As our business logic scales, maintaining type definitions and API contracts manually across the server and multiple clients leads to increased mental overhead, duplication of types, and painful out-of-sync runtime errors.

We evaluated several end-to-end type-safe API solutions such as tRPC and simple fetch wrappers with Zod. While tRPC is standard in the ecosystem, we need to generate OpenAPI specifications easily to consume them in external tools (e.g., Scalar API references) and non-TypeScript clients if required. oRPC provides a similar developer experience to tRPC but handles standard HTTP gracefully and includes native OpenAPI integrations.

## Decision
We will use **oRPC** as the primary API layer (\`packages/api\`) to construct our server routers and expose them to our clients. 

- **Single Source of Truth**: \`packages/api\` will import validators from \`packages/validators\` and query \`packages/db\`.
- **Client Integration**: Both \`apps/web\` and \`apps/mobile\` will consume the oRPC React Query client bindings out of the box, receiving instant IDE auto-completion.
- **OpenAPI**: The oRPC router will automatically generate an OpenAPI specification which will be served at \`apps/web/src/app/api/openapi.json/route.ts\` and consumed by our Scalar API Reference page.

## Consequences
### Positive Outcomes
- **Zero-Duplication**: We no longer need to write types for responses in the clients.
- **Fail-Fast**: Breaking changes made in the API layer will immediately trigger TypeScript errors in the Next.js and Expo clients before runtime.
- **Self-Documenting**: Real-time integration with Scalar UI means our documentation is always automatically accurate and up-to-date.

### Negative Outcomes / Challenges
- **Learning Curve**: New contributors familiar with REST or standard tRPC will need to learn oRPC's specific syntax.
- **Bundle Considerations**: Adding a full abstraction layer can introduce slight overhead, though oRPC remains minimal. 
