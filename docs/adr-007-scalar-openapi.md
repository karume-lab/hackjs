---
title: "ADR-007: Scalar & OpenAPI"
description: "Automated API Documentation via Scalar and OpenAPI."
---

# ADR-007: Automated API Documentation via Scalar and OpenAPI

## Status
Accepted

## Context
Given our backend heavily utilizes oRPC to construct an API for our internal web and mobile clients, the external (or broader internal team) narrative of how to converse with the API often decays. 

Historically, maintaining a REST API references (Swagger docs, Postman collections) requires distinct duplication of effort. Whenever a route or validator is changed, a manual update to the documentation site would follow, invariably leading to out-of-sync documentation.

## Decision
We elected to adopt **Scalar** paired with oRPC's native **OpenAPI** generation to create a fully automatic, highly-designed API reference page.

- **OpenAPI Standards**: Our internal oRPC type definitions and Zod schemas inherently compile into a standard OpenAPI JSON spec via `@orpc/openapi`. This specification is served dynamically.
- **Scalar UI**: Scalar provides a best-in-class, developer-friendly interface that feels modern, fast, and interactive.
- **Next.js Integration**: The Scalar React components (`@scalar/nextjs-api-reference`) allow us to embed the entire documentation suite directly inside a Next.js route without requiring an Iframe or an external host.

## Consequences

### Positive Outcomes
- **Zero Drift Documentation**: The API documentation is tightly coupled to the code. If a Zod schema changes the API contract, the Scalar docs update instantly without a single manual edit.
- **Interactive Playgrounds**: Developers can authenticate and execute requests directly from the docs site, streamlining onboarding. 
- **Beautiful UX**: Scalar offers superior aesthetics and typography out-of-the-box compared to legacy Swagger-UI implementations.

### Negative Outcomes / Challenges
- **Custom Zod Limitations**: Highly custom Zod validations (e.g., chained super-refines) may not express perfectly into the OpenAPI standard format.
- **Route Visibility**: Not all internal oRPC endpoints generally need to be exposed; deliberate configuration is required to hide or tag internal-only routes.
