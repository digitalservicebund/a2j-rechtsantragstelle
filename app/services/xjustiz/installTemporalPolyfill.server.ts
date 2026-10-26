import { Temporal as TemporalPolyfill } from "@js-temporal/polyfill";

declare global {
  // oxlint-disable-next-line no-var
  var Temporal: typeof TemporalPolyfill | undefined;
}

// Called explicitly, since "sideEffects": false lets the bundler drop bare imports.
export function installTemporalPolyfill() {
  globalThis.Temporal ??= TemporalPolyfill;
}
