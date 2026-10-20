import { type ErbscheinWegweiserUserData } from "~/domains/nachlass/erbschein/wegweiser/userData";
import type { Flow } from "~/domains/flows.server";
import { erbscheinWegweiserFlowConfig } from "./flowConfig";

export const erbscheinWegweiser = {
  flowType: "vorabCheck",
  stringReplacements: (userData: ErbscheinWegweiserUserData) => ({
    hasGrundeigentumAndHandwrittenTestament:
      userData.testamentType === "handwritten" &&
      userData.hasGrundeigentum === "yes",
  }),
  config: erbscheinWegweiserFlowConfig,
} satisfies Flow<typeof erbscheinWegweiserFlowConfig.pages>;
