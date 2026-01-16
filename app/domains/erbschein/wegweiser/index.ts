import { erbscheinWegweiserXstateConfig } from "~/domains/erbschein/wegweiser/xStateConfig";
import type { Flow } from "~/domains/flows.server";

export const erbscheinWegweiser = {
  flowType: "vorabCheck",
  config: erbscheinWegweiserXstateConfig,
  guards: {},
  stringReplacements: () => ({}),
} satisfies Flow;
