import { type ErbscheinWegweiserUserData } from "~/domains/nachlass/erbschein/wegweiser/userData";
import type { Flow } from "~/domains/flows.server";
import { erbscheinWegweiserFlowConfig } from "./flowConfig";

export const nachlassErbscheinWegweiser = {
  flowType: "vorabCheck",
  config: { states: {} },
  guards: {},
  stringReplacements: (userData: ErbscheinWegweiserUserData) => ({
    hasGrundeigentumAndHandwrittenTestament:
      userData.testamentType === "handwritten" &&
      userData.hasGrundeigentum === "yes",
  }),
  newEngineConfig: erbscheinWegweiserFlowConfig,
} satisfies Flow<typeof erbscheinWegweiserFlowConfig.pages>;
