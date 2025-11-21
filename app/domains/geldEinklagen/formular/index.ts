import type { Flow } from "~/domains/flows.server";
import { gerichtPruefenXstateConfig } from "./gericht-pruefen/xstateConfig";
import { isBeklagtePerson } from "./stringReplacements";
import { type GeldEinklagenFormularUserData } from "./userData";

export const geldEinklagenFormular = {
  flowType: "formFlow",
  stringReplacements: (context: GeldEinklagenFormularUserData) => ({
    ...isBeklagtePerson(context),
    postleitzahlBeklagtePerson: context.postleitzahlBeklagtePerson,
    postleitzahlSecondary: context.postleitzahlSecondary,
  }),
  config: {
    id: "/geld-einklagen/formular",
    initial: "gericht-pruefen",
    meta: {
      pruneDataFromPageSchema: true,
    },
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
