import type { Flow } from "~/domains/flows.server";
import { geldEinklagenAnwaltschaftFlowConfig } from "./flowConfig";

export const geldEinklagenAnwaltschaft = {
  flowType: "formFlow",
  config: {
    id: "/geld-einklagen/anwaltschaft",
    states: {},
  },
  stringReplacements: () => ({}),
  newEngineConfig: geldEinklagenAnwaltschaftFlowConfig,
} satisfies Flow<typeof geldEinklagenAnwaltschaftFlowConfig.pages>;
