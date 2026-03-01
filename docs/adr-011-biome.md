---
title: "ADR-011: Biome"
description: "Unified Quality Control using Biome."
---

# ADR-011: Unified Quality Control using Biome

## Status
Accepted

## Context
Ensuring consistent formatting and code-quality heuristics are critical in a massive Monorepo contributed to by many developers.

For the past decade, the community standard has been heavily fragmented: using `Prettier` for formatting, `ESLint` for static analysis, and sometimes specific `tsconfig` plugins. Parsing the AST multiple times via different JS-based toolings significantly slows down pre-commit hooks and local CI validation cycles.

We wanted to streamline linting and formatting without giving up strict enforcement capabilities, particularly removing the friction of conflicting Prettier/ESLint overlapping rules.

## Decision
We aggressively adopted **Biome** to completely replace both Prettier and ESLint.

- **Unified Toolchain**: Biome acts as a single tool that handles both rapid compilation/formatting and deep syntactic linting natively.
- **Rust Backend**: Written in Rust, Biome executes infinitely faster than standard JS implementations of Prettier/ESLint, enabling us to run total monorepo checks on multi-thousand file repositories almost instantaneously.
- **Strict Formatting**: It adheres natively to 99% of Prettier's standards by default, ensuring immediate developer familiarity while avoiding endless configuration debates.
- **Lefthook Integration**: Biome handles formatting natively as a pre-commit check using `lefthook`, preventing ill-formatted code from ever reaching remote. 

## Consequences

### Positive Outcomes
- **Astounding Speed**: Full monorepo lint and format checks take fractions of a second rather than minutes.
- **Configuration simplicity**: A single `biome.json` at the monorepo root configures everything without complex Javascript rule overrides, plugin chaining, or resolving dependency conflicts.
- **Error Recoverability**: Biome's diagnostics output pinpoints exactly what rule broke in terminal logs with vastly superior UX compared to standard ESLint traces.

### Negative Outcomes / Challenges
- **Plugin Ecosystem**: Biome is relatively young. While it covers core TS/React paradigms perfectly, highly niche Next.js or third-party ESLint plugins may not yet have a 1:1 Biome equivalent.
- **Editor Tooling**: Developers must configure their IDEs to use the Biome VSCode extension instead of resolving standard Prettier watchers.
