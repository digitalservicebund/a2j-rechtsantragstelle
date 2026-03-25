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
  hasKlagendePersonStatePlzPrefilled,
  hasBeklagtePersonStatePlzPrefilled,
} from "./stringReplacements";
import { type GeldEinklagenFormularUserData } from "./userData";
import { klageErstellenXstateConfig } from "./klage-erstellen/xStateConfig";
import { klageHerunterladenXstateConfig } from "./klage-herunterladen/xStateConfig";
import {
  prefillZipCode,
  updateIfUserNotPrefilledBeklagtePlz,
  updateIfUserNotPrefilledKlagendePersonPlz,
} from "../services/prefillZipCode";

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
    ...hasKlagendePersonStatePlzPrefilled(context),
    ...hasBeklagtePersonStatePlzPrefilled(context),
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
  asyncFlowActions: {
    "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person":
      prefillZipCode,
    "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person":
      prefillZipCode,
    "/klage-erstellen/intro/start": prefillZipCode,
    "/gericht-pruefen/zustaendiges-gericht/pilot-gericht": prefillZipCode,
    "/gericht-pruefen/klagende-person/kaufmann": prefillZipCode,
    "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung":
      prefillZipCode,
    "/klage-erstellen/klagende-person/kontaktdaten":
      updateIfUserNotPrefilledKlagendePersonPlz,
    "/klage-erstellen/beklagte-person/mensch":
      updateIfUserNotPrefilledBeklagtePlz,
    "/klage-erstellen/beklagte-person/organisation":
      updateIfUserNotPrefilledBeklagtePlz,
  },
} satisfies Flow;
