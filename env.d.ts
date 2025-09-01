/// <reference types="vite/client" />
// oxlint-disable @typescript-eslint/consistent-indexed-object-style @typescript-eslint/no-empty-object-type @typescript-eslint/consistent-type-definitions
import type { Assertion } from "vitest";

interface CustomMatchers<R = unknown> {
  toContainStrapiPage: (strapiPage: string | null) => R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
