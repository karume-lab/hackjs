---
title: "ADR-005: Next.js App Router"
description: "Web Frontend via Next.js App Router."
---

# ADR-005: Web Frontend via Next.js App Router

## Status
Accepted

## Context
Our web application needs to serve as a high-performance marketing and application surface. Historically, single-page applications (React via Vite/CRA) suffered from large initial bundle sizes and poor SEO.

We required a React meta-framework capable of rendering content on the server (for SEO and low time-to-first-byte) while still supporting rich, interactive client-side logic. 

## Decision
We chose the **Next.js App Router** for our primary web application (`apps/web`).

- **React Server Components (RSC)**: The App Router fundamentally shifts the rendering paradigm, allowing us to fetch data securely on the server without exposing secrets or shipping bloated JavaScript to the browser.
- **Server Actions**: Mutations can be handled directly via Server Actions, allowing forms to work seamlessly while keeping business logic out of client bundles.
- **Ecosystem Dominance**: Next.js is heavily supported by the community, Vercel, and modern UI libraries (Shadcn, oRPC, Better Auth), making integration trivial.
- **Routing**: The file-system based routing using nested layouts provides a clean declarative way to structure complex user interfaces.

## Consequences

### Positive Outcomes
- **Performance**: Zero-JS loading states and streaming Server Components yield exceptional Core Web Vitals.
- **SEO**: Static generation and robust metadata APIs ensure that the web app can be correctly indexed by search engines.
- **Fullstack Reactivity**: Trivial data mutation via server actions dramatically reduces boilerplate compared to standard API routes + fetch hooks.

### Negative Outcomes / Challenges
- **Mental Model Transition**: Developers accustomed to classic React (useEffect/useState for fetching) must adapt to the "Client vs Server Component" paradigm.
- **Caching Complexity**: The Next.js aggressive caching strategy requires explicit directives (`revalidatePath`, `revalidateTag`) which can be confusing to debug initially.
