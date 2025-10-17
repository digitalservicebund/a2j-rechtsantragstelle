import type { Flow } from "~/domains/flows.server";
import { gerichtPruefenXstateConfig } from "./gericht-pruefen/xstateConfig";
import { isBeklagtePerson } from "./stringReplacements";

export const geldEinklagenFormular = {
  flowType: "formFlow",
  stringReplacements: () => ({
    ...isBeklagtePerson,
  }),
  config: {
    id: "/geld-einklagen/formular",
    initial: "gericht-pruefen",
    meta: { useStepper: true },
    states: {
      "gericht-pruefen": gerichtPruefenXstateConfig,
    },
  },
  guards: {},
} satisfies Flow;
