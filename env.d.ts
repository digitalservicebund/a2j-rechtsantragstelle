/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />
interface CustomMatchers<R = unknown> {
  toContainStrapiPages: (
    received: {
      flowId: FlowId;
      allPossibleStates: string[];
    },
    strapiPage: string,
  ) => R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
