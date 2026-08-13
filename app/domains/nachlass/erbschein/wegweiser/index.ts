import { type NachlassErbscheinWegweiserUserData } from "~/domains/nachlass/erbschein/wegweiser/userData";
import type { Flow } from "~/domains/flows.server";
import { nachlassErbscheinWegweiserFlowConfig } from "./flowConfig";

export const nachlassErbscheinWegweiser = {
  flowType: "vorabCheck",
  config: { states: {} },
  guards: {},
  stringReplacements: (userData: NachlassErbscheinWegweiserUserData) => ({
    hasGrundeigentumAndHandwrittenTestament:
      userData.testamentType === "handwritten" &&
      userData.hasGrundeigentum === "yes",
  }),
  newEngineConfig: nachlassErbscheinWegweiserFlowConfig,
} satisfies Flow<typeof nachlassErbscheinWegweiserFlowConfig.pages>;
