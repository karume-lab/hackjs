---
title: "ADR-010: UI Architecture"
description: "UI Architecture with Tailwind CSS and Shadcn/ui."
---

# ADR-010: UI Architecture with Tailwind CSS and Shadcn/ui

## Status
Accepted

## Context
A major challenge of monorepos is maintaining design-system consistency across multiple applications without incurring massive bespoke CSS build configurations.

We needed a styling solution that feels familiar to developers, scales predictably across the web ecosystem (Next.js), and extends natively to React Native.

Historically, CSS-in-JS solutions (Emotion, Styled Components) provided great component isolation but suffered tremendous runtime performance hits and were strongly discouraged entirely by React Core Server Components (RSC) architectures. 

## Decision
We elected to adopt **Tailwind CSS v4** as the primary styling language, paired directly with **shadcn/ui** for web component primitives.

- **Tailwind CSS**: The utility-first API is the industry standard. It relies on a single compiler rather than complex runtime injection. It removes CSS payload size scaling inherently (you only ship the utilities you write), creating robust, cacheable UI blocks.
- **shadcn/ui**: Instead of importing a rigid, massive UI library as an opaque node_module dependency, shadcn/ui provides beautifully designed, fully accessible Radix UI component implementations mapped into our own `packages/ui` workspace. We own the code, the structural layers, and strictly type the component APIs.
- **React Native Reusables (Mobile)**: We employ similar patterns (Tailwind via Nativewind) to style our Expo app, ensuring that developers think in a single "Tailwind Context" across Web and Mobile.

## Consequences

### Positive Outcomes
- **Design System Velocity**: Extracting Shadcn components directly into `packages/ui` establishes a rapid, highly polished baseline for all new applications interacting with the web.
- **RSC Compatibility**: Tailwind works beautifully alongside React Server Components, eliminating CSS-in-JS Flash of Unstyled Content (FOUC) completely.
- **Unrestricted Customization**: Because Shadcn gives us raw source code that sits in our repo, we are free to change DOM structures, add specific animation variants, or modify types without waiting for an upstream PR to an external library.

### Negative Outcomes / Challenges
- **Markup Density**: Tailwind results in long `className` strings which can clutter React element declarations unless carefully extracted using tools like `tailwind-merge` and `class-variance-authority` (cva).
- **Mobile Specifics**: Nativewind creates an excellent bridge, but applying utility classes to native primitives has distinct behavior differences from standard HTML/CSS DOM box-models.
