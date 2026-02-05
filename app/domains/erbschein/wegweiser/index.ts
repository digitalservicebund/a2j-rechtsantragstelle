import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";
import { erbscheinWegweiserXstateConfig } from "~/domains/erbschein/wegweiser/xStateConfig";
import type { Flow } from "~/domains/flows.server";

export const erbscheinWegweiser = {
  flowType: "vorabCheck",
  config: erbscheinWegweiserXstateConfig,
  guards: {},
  stringReplacements: (userData: ErbscheinWegweiserUserData) => ({
    hasGrundeigentumAndHandwrittenTestament:
      userData.testamentType === "handwritten" &&
      userData.hasGrundeigentum === "yes",
  }),
} satisfies Flow;
