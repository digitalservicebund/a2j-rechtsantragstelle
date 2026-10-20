import type { Flow } from "~/domains/flows.server";
import { kontopfaendungPkontoAntragFlowConfig } from "./flowConfig";

export const kontopfaendungPkontoAntrag = {
  flowType: "formFlow",
  stringReplacements: () => ({}),
  config: kontopfaendungPkontoAntragFlowConfig,
} satisfies Flow<typeof kontopfaendungPkontoAntragFlowConfig.pages>;
