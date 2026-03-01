---
title: "ADR-002: Better Auth"
description: "Unified Authentication with Better Auth."
---

# ADR-002: Unified Authentication with Better Auth

## Status
Accepted

## Context
Our monorepo targets both Next.js (web) and React Native/Expo (mobile). We required an authentication solution that works seamlessly across multiple runtimes, provides robust session management, scales easily, and allows deep customization without vendor lock-in. 

We considered alternatives like NextAuth.js (Auth.js) and Supabase Auth. While NextAuth is the ecosystem standard for Next.js, its mobile story (React Native) is traditionally complex, relying on webviews or custom session mappings. Supabase is powerful but couples us heavily to their proprietary ecosystem (though we could self-host).

## Decision
We elected to use **Better Auth** as our universal authentication provider, managed centrally in \`packages/auth\`.

- **Runtime Agnostic**: Better Auth works seamlessly across Node, Bun, and edge runtimes, meaning it easily plugs into our oRPC/Next.js backend.
- **Expo/React Native Support**: Better Auth provides robust API endpoints that our React Native client can consume directly with standard fetch requests and secure token storage, removing the need for complex webview workarounds.
- **Framework Independent Core**: The authentication logic resides in \`packages/auth\`, decoupled from Next.js. The Next.js \`app/api/auth/[...all]/route.ts\` merely re-exports the Better Auth handler.
- **Drizzle Integration**: Better Auth natively supports Drizzle ORM, allowing us to keep our user tables and session tables directly inside \`packages/db\` with full type safety.

## Consequences

### Positive Outcomes
- **Single Source of Truth**: User sessions, schemas, and authentication logic are defined once in the monorepo.
- **Native Mobile Auth**: The Expo app can authenticate natively, yielding a premium UX compared to webview redirects.
- **Full Data Ownership**: Because it integrates with our Drizzle database, we own all user data and session tables immediately.

### Negative Outcomes / Challenges
- **Ecosystem Maturity**: Better Auth is newer than NextAuth; we may encounter edge cases with specific OAuth providers that have fewer community examples.
