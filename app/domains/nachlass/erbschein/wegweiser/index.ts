import { type NachlassErbscheinWegweiserUserData } from "~/domains/nachlass/erbschein/wegweiser/userData";
import { nachlassErbscheinWegweiserXstateConfig } from "~/domains/nachlass/erbschein/wegweiser/xStateConfig";
import type { Flow } from "~/domains/flows.server";

export const nachlassErbscheinWegweiser = {
  flowType: "vorabCheck",
  config: nachlassErbscheinWegweiserXstateConfig,
  guards: {},
  stringReplacements: (userData: NachlassErbscheinWegweiserUserData) => ({
    hasGrundeigentumAndHandwrittenTestament:
      userData.testamentType === "handwritten" &&
      userData.hasGrundeigentum === "yes",
  }),
} satisfies Flow;
