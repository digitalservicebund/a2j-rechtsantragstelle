/// <reference types="vite/client" />
import type { Assertion } from "vitest";

interface CustomMatchers<R = unknown> {
  toContainStrapiPage: (strapiPage: string | null) => R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
