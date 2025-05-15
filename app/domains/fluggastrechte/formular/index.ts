import merge from "lodash/merge";
import type { Flow } from "~/domains/flows.server";
import type { ArrayConfigServer } from "~/services/array";
import {
  storeMainPersonConsent,
  storeMultiplePersonsConsent,
} from "~/services/externalDataStorage/storeConsentFgrToS3Bucket";
import type { FlowTransitionConfig } from "~/services/flow/server/flowTransitionValidation";
import { fluggastrechteAbgabe } from "./abgabe/xstateConfig";
import type { FluggastrechtContext } from "./context";
import { flugdatenDone } from "./flugdaten/doneFunctions";
import { fluggastrechteFlugdaten } from "./flugdaten/xstateConfig";
import { grundvoraussetzungenDone } from "./grundvoraussetzungen/doneFunctions";
import { fluggastrechteGrundvoraussetzungen } from "./grundvoraussetzungen/xstateConfig";
import { fluggastrechteGuards } from "./guards";
import {
  personDone,
  weiterePersonenDone,
} from "./persoenlicheDaten/doneFunctions";
import { fluggastrechtePersoenlicheDaten } from "./persoenlicheDaten/xstateConfig";
import { prozessfuehrungDone } from "./prozessfuehrung/doneFunctions";
import { fluggastrechteProzessfuehrung } from "./prozessfuehrung/xstateConfig";
import { isTotalClaimWillSucceddedAboveLimit } from "./services/isTotalClaimAboveLimit";
import { streitwertKostenDone } from "./streitwertKosten/doneFunctions";
import { fluggastrechteStreitwertKosten } from "./streitwertKosten/xstateConfig";
import {
  getAirlineName,
  getAnnullierungInfo,
  getArrayWeiterePersonenIndexStrings,
  getEndAirportName,
  getFirstZwischenstoppAirportName,
  getPersonNachname,
  getPersonVorname,
  getResponsibleAirportForCourt,
  getResponsibleCourt,
  getSecondZwischenstoppAirportName,
  getStartAirportName,
  getStreitwert,
  getThirdZwischenstoppAirportName,
  getWeiterePersonenNameStrings,
  hasBothAirportsPartnerCourts,
  isAnnullierung,
  isNichtBefoerderung,
  isVerspaetet,
  isWeiterePersonen,
  WEITERE_PERSONEN_START_INDEX,
} from "./stringReplacements";
import { fluggastrechteZusammenfassung } from "./zusammenfassung/xstateConfig";

const flowTransitionConfig: FlowTransitionConfig = {
  sourceFlowId: "/fluggastrechte/vorabcheck",
  eligibleSourcePages: ["/ergebnis/erfolg"],
};

const asyncFlowActions = {
  "/grundvoraussetzungen/datenverarbeitung": storeMainPersonConsent,
  "/persoenliche-daten/weitere-personen/person/daten":
    storeMultiplePersonsConsent,
};

export const fluggastrechtFlow = {
  flowType: "formFlow",
  migration: {
    source: "/fluggastrechte/vorabcheck",
    sortedFields: [
      "bereich",
      "startAirport",
      "endAirport",
      "fluggesellschaft",
      "ankuendigung",
      "ersatzflug",
      "ersatzflugStartenEinStunde",
      "ersatzflugLandenZweiStunden",
      "ersatzflugStartenZweiStunden",
      "ersatzflugLandenVierStunden",
      "entschaedigung",
    ],
    buttonUrl: "/fluggastrechte/formular/redirect-to-vorabcheck",
  },
  stringReplacements: (context: FluggastrechtContext) => ({
    ...getStartAirportName(context),
    ...getEndAirportName(context),
    ...getPersonVorname(context),
    ...getPersonNachname(context),
    ...getArrayWeiterePersonenIndexStrings(context),
    ...getWeiterePersonenNameStrings(context),
    ...getAirlineName(context),
    ...getFirstZwischenstoppAirportName(context),
    ...getSecondZwischenstoppAirportName(context),
    ...getThirdZwischenstoppAirportName(context),
    ...getResponsibleCourt(context),
    ...isVerspaetet(context),
    ...isNichtBefoerderung(context),
    ...isAnnullierung(context),
    ...isWeiterePersonen(context),
    ...getStreitwert(context),
    ...getAnnullierungInfo(context),
    ...hasBothAirportsPartnerCourts(context),
    ...getResponsibleAirportForCourt(context),
    isClaimWillSucceddedAboveLimit:
      isTotalClaimWillSucceddedAboveLimit(context),
  }),
  config: {
    meta: {
      arrays: {
        weiterePersonen: {
          url: "/fluggastrechte/formular/persoenliche-daten/weitere-personen/person",
          initialInputUrl: "daten",
          statementKey: "isWeiterePersonen",
          hiddenFields: ["anrede", "title", "datenverarbeitungZustimmung"],
          event: "add-weiterePersonen",
          displayIndexOffset: WEITERE_PERSONEN_START_INDEX,
          shouldDisableAddButton: isTotalClaimWillSucceddedAboveLimit,
        },
      } satisfies Partial<
        Record<keyof FluggastrechtContext, ArrayConfigServer>
      >,
    },
    id: "/fluggastrechte/formular",
    initial: "intro",
    states: {
      intro: {
        id: "intro",
        initial: "start",
        meta: { done: () => true },
        states: {
          start: {
            on: {
              SUBMIT: "#grundvoraussetzungen.datenverarbeitung",
              BACK: "redirect-vorabcheck-ergebnis",
            },
          },
          "redirect-vorabcheck-ergebnis": { on: {} },
        },
      },
      grundvoraussetzungen: merge(fluggastrechteGrundvoraussetzungen, {
        meta: { done: grundvoraussetzungenDone },
      }),
      "streitwert-kosten": merge(fluggastrechteStreitwertKosten, {
        meta: { done: streitwertKostenDone },
      }),
      flugdaten: merge(fluggastrechteFlugdaten, {
        meta: { done: flugdatenDone },
      }),
      "persoenliche-daten": merge(fluggastrechtePersoenlicheDaten, {
        states: {
          person: { meta: { done: personDone } },
          "weitere-personen": { meta: { done: weiterePersonenDone } },
        },
      }),
      prozessfuehrung: merge(fluggastrechteProzessfuehrung, {
        meta: { done: prozessfuehrungDone },
      }),
      zusammenfassung: merge(fluggastrechteZusammenfassung, {
        meta: { done: () => false },
      }),
      abgabe: merge(fluggastrechteAbgabe, {
        meta: { done: () => false },
      }),
    },
  },
  guards: fluggastrechteGuards,
  flowTransitionConfig,
  asyncFlowActions,
} satisfies Flow;
