import type { Flow } from "~/domains/flows.server";
import { kontopfaendungPkontoAntragXStateConfig } from "./xStateConfig";

export const kontopfaendungPkontoAntrag = {
  flowType: "formFlow",
  config: kontopfaendungPkontoAntragXStateConfig,
  guards: {},
  stringReplacements: () => ({}),
} satisfies Flow;
