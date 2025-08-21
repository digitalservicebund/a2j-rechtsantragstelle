import type { Flow } from "~/domains/flows.server";
import { geldEinklagenVorabcheckXstateConfig } from "./xstateConfig";

export const geldEinklagenVorabcheck = {
  flowType: "vorabCheck",
  stringReplacements: () => ({}),
  config: geldEinklagenVorabcheckXstateConfig,
  guards: {},
} satisfies Flow;
