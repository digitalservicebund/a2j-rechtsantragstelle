import type { Flow } from "~/domains/flows.server";
import { gerichtPruefenXstateConfig } from "./gericht-pruefen/xstateConfig";
import {
  getOptionsCourts,
  getResponsibleCourtString,
  hasClaimVertrag,
  hasExclusivePlaceJurisdictionOrSelectCourt,
  isBeklagtePerson,
  isCourtAGSchoeneberg,
  getCourtCost,
  hasAnwaltskosten,
  hasStreitbeilegungGruende,
  hasBeweiseAngebot,
  hasAnwaltschaft,
} from "./stringReplacements";
import { type GeldEinklagenFormularUserData } from "./userData";
import { klageErstellenXstateConfig } from "./klage-erstellen/xStateConfig";
import { klageHerunterladenXstateConfig } from "./klage-herunterladen/xStateConfig";

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
    ...isCourtAGSchoeneberg(context),
    ...getCourtCost(context),
    ...hasAnwaltskosten(context),
    ...hasStreitbeilegungGruende(context),
    ...hasBeweiseAngebot(context),
    ...hasAnwaltschaft(context),
  }),
  config: {
    id: "/geld-einklagen/formular",
    initial: "gericht-pruefen",
    states: {
      "gericht-pruefen": gerichtPruefenXstateConfig,
      "klage-erstellen": klageErstellenXstateConfig,
      "klage-herunterladen": klageHerunterladenXstateConfig,
    },
  },
  useStepper: true,
} satisfies Flow;
