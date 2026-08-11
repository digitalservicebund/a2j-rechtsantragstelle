import type { Flow } from "~/domains/flows.server";
import { kontopfaendungPkontoAntragFlowConfig } from "./flowConfig";

export const kontopfaendungPkontoAntrag = {
  flowType: "formFlow",
  config: { states: {} },
  stringReplacements: () => ({}),
  newEngineConfig: kontopfaendungPkontoAntragFlowConfig,
} satisfies Flow<typeof kontopfaendungPkontoAntragFlowConfig.pages>;
