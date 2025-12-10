import type { Flow } from "~/domains/flows.server";
import { gerichtPruefenXstateConfig } from "./gericht-pruefen/xstateConfig";
import {
  getOptionsCourts,
  getResponsibleCourtString,
  hasClaimVertrag,
  hasExclusivePlaceJurisdictionOrSelectCourt,
  isBeklagtePerson,
} from "./stringReplacements";
import { type GeldEinklagenFormularUserData } from "./userData";
import { klageErstellenXstateConfig } from "./klage-erstellen/xStateConfig";

export const geldEinklagenFormular = {
  flowType: "formFlow",
  stringReplacements: (context: GeldEinklagenFormularUserData) => ({
    ...isBeklagtePerson(context),
    postleitzahlBeklagtePerson: context.postleitzahlBeklagtePerson,
    postleitzahlSecondary: context.postleitzahlSecondary,
    ...hasClaimVertrag(context),
    ...getOptionsCourts(context),
    ...getResponsibleCourtString(context),
    ...hasExclusivePlaceJurisdictionOrSelectCourt(context),
  }),
  config: {
    id: "/geld-einklagen/formular",
    initial: "gericht-pruefen",
    meta: {
      pruneDataFromPageSchema: true,
    },
    states: {
      "gericht-pruefen": gerichtPruefenXstateConfig,
      "klage-erstellen": klageErstellenXstateConfig,
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
