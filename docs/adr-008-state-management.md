---
title: "ADR-008: State Management"
description: "State Management with TanStack Query and nuqs."
---

# ADR-008: State Management with TanStack Query and nuqs

## Status
Accepted

## Context
Managing async data (server state) and synchronous UI interaction data (client state) correctly handles 90% of a modern web application's generic "state management" burden. Historically, massive Redux stores tried to do both, resulting in immense boilerplate and caching invalidation errors.

We must handle API requests optimally (caching, deduplication, retry) alongside deterministic UX states (filtering, sorting) that can be shared or linked.

## Decision
We adopted **TanStack Query (React Query)** for server state and **nuqs** for client/URL state management.

- **TanStack Query**: oRPC naturally binds to React Query, providing us an out-of-the-box system for fetching, caching, and updating asynchronous backend data seamlessly in both React Native and Next.js.
- **nuqs**: Instead of relying on `React.useState` for complex UI table states (like active tabs, search pagination, filters), we use `nuqs` to synchronize state with the URL Search Params. This makes every state in our Next.js web application linkable, shareable, and refresh-safe.

## Consequences

### Positive Outcomes
- **Optimistic Updates**: React Query enables highly responsive UIs by optimistically rendering mutations against the cache before the server responds.
- **URL-First Design**: By storing search bounds and tab settings in the URL via `nuqs`, users can bookmark, refresh, and share direct configurations of dashboards seamlessly without losing state context.
- **Zero Global Client Stores**: We completely eliminate the need for global state managers like Redux or Zustand for 95% of our codebase.

### Negative Outcomes / Challenges
- **Cache Invalidation Complexity**: Managing React Query caches correctly (knowing when and exactly which keys to invalidate after a mutation) is non-trivial compared to simpler fetch implementations.
- **Next.js Router Navigations**: Tying state heavily to Search Params via `nuqs` forces frequent Next.js router transitions, which must be managed carefully using `shallow` routing to prevent expensive layout re-renders. 
