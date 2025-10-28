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
    states: {
      "gericht-pruefen": gerichtPruefenXstateConfig,
      "klage-erstellen": {
        id: "klage-erstellen",
        initial: "intro",
        states: {
          intro: {
            id: "intro",
            initial: "start",
            states: {
              start: {
                on: {},
              },
            },
          },
        },
      },
      "klage-herunterladen": {
        id: "klage-herunterladen",
        initial: "intro",
        states: {
          intro: {
            id: "intro",
            initial: "start",
            states: {
              start: {
                on: {},
              },
            },
          },
        },
      },
    },
  },
  guards: {},
  useStepper: true,
} satisfies Flow;
