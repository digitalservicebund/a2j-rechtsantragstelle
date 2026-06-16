import type { Flow } from "~/domains/flows.server";
import { nachlassErbausschlagungGerichtFindenXstateConfig } from "~/domains/nachlass/erbausschlagung/gericht-finden/xStateConfig";

export const nachlassErbausschlagungGerichtFinden = {
  flowType: "vorabCheck",
  config: nachlassErbausschlagungGerichtFindenXstateConfig,
  stringReplacements: () => ({}),
} satisfies Flow;
