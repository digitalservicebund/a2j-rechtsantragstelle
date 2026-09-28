import { Temporal as TemporalPolyfill } from "@js-temporal/polyfill";

declare global {
  // oxlint-disable-next-line no-var
  var Temporal: typeof TemporalPolyfill | undefined;
}

globalThis.Temporal ??= TemporalPolyfill;
