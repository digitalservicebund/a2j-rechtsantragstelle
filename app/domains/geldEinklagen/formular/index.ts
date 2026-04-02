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
  hasKlagendePersonStatePrefilled,
  hasBeklagtePersonStatePrefilled,
} from "./stringReplacements";
import { type GeldEinklagenFormularUserData } from "./userData";
import { klageErstellenXstateConfig } from "./klage-erstellen/xStateConfig";
import { klageHerunterladenXstateConfig } from "./klage-herunterladen/xStateConfig";
import {
  prefillZipCodeAndCity,
  updateIfUserNotPrefilledBeklagte,
  updateIfUserNotPrefilledKlagendePerson,
} from "../services/prefillZipCodeAndCity";

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
    ...hasKlagendePersonStatePrefilled(context),
    ...hasBeklagtePersonStatePrefilled(context),
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
      prefillZipCodeAndCity,
    "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person":
      prefillZipCodeAndCity,
    "/klage-erstellen/intro/start": prefillZipCodeAndCity,
    "/gericht-pruefen/zustaendiges-gericht/pilot-gericht":
      prefillZipCodeAndCity,
    "/gericht-pruefen/klagende-person/kaufmann": prefillZipCodeAndCity,
    "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung":
      prefillZipCodeAndCity,
    "/klage-erstellen/klagende-person/kontaktdaten":
      updateIfUserNotPrefilledKlagendePerson,
    "/klage-erstellen/beklagte-person/mensch": updateIfUserNotPrefilledBeklagte,
    "/klage-erstellen/beklagte-person/organisation":
      updateIfUserNotPrefilledBeklagte,
  },
} satisfies Flow;
