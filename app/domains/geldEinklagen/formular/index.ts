import type { Flow } from "~/domains/flows.server";
import { gerichtPruefenXstateConfig } from "./gericht-pruefen/xstateConfig";

export const geldEinklagenFormular = {
  flowType: "formFlow",
  stringReplacements: () => ({}),
  config: {
    id: "/geld-einklagen/formular",
    initial: "gericht-pruefen",
    states: {
      "gericht-pruefen": gerichtPruefenXstateConfig,
    },
  },
  guards: {},
  useStepper: true,
} satisfies Flow;
