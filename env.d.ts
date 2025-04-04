/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />
import type { Assertion } from "vitest";

interface CustomMatchers<R = unknown> {
  toContainStrapiPage: (strapiPage: string | null) => R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}
