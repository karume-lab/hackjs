---
title: "ADR-006: Expo Router"
description: "Native Mobile App via React Native and Expo Router."
---

# ADR-006: Native Mobile App via React Native and Expo Router

## Status
Accepted

## Context
Deploying a single unified codebase where iOS and Android native code sits alongside our React web frontend is historically complex, usually requiring two completely divergent toolchains.

However, sharing validators, UI logic, and APIs is non-negotiable. To achieve an actual cross-platform workspace, we need a mobile strategy that allows us to import `packages/*` directly while compiling smoothly into native App/Play store bundles.

## Decision
We decided to adopt **React Native** via **Expo (and Expo Router)** for `apps/mobile`.

- **Metro and Turborepo**: Expo's Metro bundler has been configured to understand workspace resolution, allowing us to import `@repo/ui`, `@repo/api`, and `@repo/validators` just as easily as we do in a web project.
- **Expo Router**: Moving away from legacy navigation systems (like React Navigation objects), we utilize Expo Router which introduces next.js-style file-based routing dynamically inside the mobile native navigation stack.
- **EAS (Expo Application Services)**: Using Expo eliminates the need to maintain raw `.xcworkspace` and `android/gradle` configurations locally. Native modules are added via Expo plugins, and builds are offloaded entirely. 

## Consequences

### Positive Outcomes
- **True Shared Logic**: Nearly 100% of our business rules, data-fetching layers (oRPC), and form validation schemas (Zod) are shared exactly as-is.
- **File System Routing**: Using Expo Router makes context switching between Next.js and React Native seamless for developers since both use nested layout files.
- **Pre-build Workflows**: Native SDK upgrades are handled by Expo, significantly reducing iOS/Android specific technical debt.

### Negative Outcomes / Challenges
- **UI Abstraction**: We cannot share DOM elements `<div />` or Next.js components natively on mobile. We must use React Native Primitives (`<View />`, `<Text />`) mapped via libraries like `nativewind` or React Native Reusables.
- **Bundle Overheads**: React Native bridges can sometimes pose performance bottlenecks on complex UI animations compared to Swift/Kotlin, requiring localized optimization.
