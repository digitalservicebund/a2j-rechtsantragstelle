# 7. Using vitest as test runner

## Status

- 2024-06-04: Drafted
- 2024-06-07: Merged
- 2024-07-24: Edited (Renumbered to `0007`)
- 2025-04-04: Edited (Added chronological status)

## Context

We are currently using [Jest](https://jestjs.io/) as our test runner, which was most popular testing framework when starting this project. However, there are a few downsides:

- It does not natively support typescript (we are using the external package `ts-jest` to mitigate)
- It does not integrate with our build pipeline `vite` (there again would be external packages such as the deprecated [vite-jest](https://github.com/sodatea/vite-jest)). This issue specifically blocks usage of vite-specific tooling, such as [vite-env-only](https://github.com/pcattori/vite-env-only)
- It does not offer in-source tests (something we did consider in ADR 0003)
- Cumbersome and hard-to-understand setup (`cssStub.js`, `resolver.cjs`, `setupAfterEnv.tests.js`)

The obvious choice going forward is [vitest](https://vitest.dev/):

- It is quickly becoming the de-facto standard for vite projects
- Small costs of porting: API is Jest compatible, so the changes are minimal
- It offers almost instant test reruns in watch mode
- solves the issues mentioned above

## Decision

We replace jest with vitest, with minimal changes (for now)

## Consequences

- Replacement of `jest` and related packages (`ts-jest`, `eslint-plugin-jest`, `@types/jest`) with `vitest`
- Adaptation of unit tests where necessary
