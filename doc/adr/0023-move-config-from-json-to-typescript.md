# 23. Migrating from `flow.json` to `xstateConfig.ts`

Date: 2025-05-19

## Status

- Drafted

## Context

Historically, flow configurations have been defined in `flow.json` files. This static JSON format offered simplicity, but it also introduced limitations in terms of flexibility and developer experience.

The RAST team began migrating flows to `xstateConfig.ts`, a TypeScript-based configuration approach. This enabled A/B Testing. However, the ZOV team paused the migration due to a lack of immediate urgency.

## Decision

We will migrate from `flow.json` to `xstateConfig.ts` for all flow definitions.

This decision is based on the following benefits:

1. Support for conditional logic (e.g. A/B Testing)
2. Type Safety
3. Onboarding Clarity
4. Avoid JSON Usage in Code

## Consequences

- Unified, type-safe configuration format across teams.
- More maintainable and expressive flow definitions.
- Less onboarding friction due to consistent structure and tooling.
- Better alignment between RAST and ZOV teams.
