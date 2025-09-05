import type { Flow } from "~/domains/flows.server";
import type { ArrayConfigServer } from "~/services/array";
import {
  storeMainPersonConsent,
  storeMultiplePersonsConsent,
} from "~/services/externalDataStorage/storeConsentFgrToS3Bucket";
import type { FlowTransitionConfig } from "~/services/flow/server/flowTransitionValidation";
import { abgabeXstateConfig } from "./abgabe/xstateConfig";
import { flugdatenXstateConfig } from "./flugdaten/xstateConfig";
import { grundvoraussetzungenXstateConfig } from "./grundvoraussetzungen/xstateConfig";
import { fluggastrechteGuards } from "./guards";
import { introXstateConfig } from "./intro/xstateConfig";
import { persoenlicheDatenXstateConfig } from "./persoenlicheDaten/xstateConfig";
import { prozessfuehrungXstateConfig } from "./prozessfuehrung/xstateConfig";
import { isTotalClaimWillSucceddedAboveLimit } from "./services/isTotalClaimAboveLimit";
import { streitwertKostenXstateConfig } from "./streitwertKosten/xstateConfig";
import {
  getAirlineAddressFromDB,
  getAirlineAddressString,
  getAirlineName,
} from "./stringReplacements/airline";
import {
  getEndAirportName,
  getFirstZwischenstoppAirportName,
  getSecondZwischenstoppAirportName,
  getStartAirportName,
  getThirdZwischenstoppAirportName,
} from "./stringReplacements/airports";
import {
  getAnnullierungInfo,
  isAnnullierung,
  isNichtBefoerderung,
  isVerspaetet,
} from "./stringReplacements/flightStatus";
import {
  getResponsibleAirportForCourt,
  getResponsibleCourt,
  getStreitwert,
  hasBothAirportsPartnerCourts,
} from "./stringReplacements/legalCourts";
import {
  getArrayWeiterePersonenIndexStrings,
  getPersonNachname,
  getPersonVorname,
  getWeiterePersonenNameStrings,
  isWeiterePersonen,
  WEITERE_PERSONEN_START_INDEX,
} from "./stringReplacements/person";
import type { FluggastrechteUserData } from "./userData";
import { zusammenfassungXstateConfig } from "./zusammenfassung/xstateConfig";

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
  stringReplacements: (context: FluggastrechteUserData) => ({
    ...getStartAirportName(context),
    ...getEndAirportName(context),
    ...getPersonVorname(context),
    ...getPersonNachname(context),
    ...getArrayWeiterePersonenIndexStrings(context),
    ...getWeiterePersonenNameStrings(context),
    ...getAirlineName(context),
    ...getAirlineAddressString(context),
    ...getAirlineAddressFromDB(context),
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
        Record<keyof FluggastrechteUserData, ArrayConfigServer>
      >,
    },
    id: "/fluggastrechte/formular",
    initial: "intro",
    states: {
      intro: introXstateConfig,
      grundvoraussetzungen: grundvoraussetzungenXstateConfig,
      "streitwert-kosten": streitwertKostenXstateConfig,
      flugdaten: flugdatenXstateConfig,
      "persoenliche-daten": persoenlicheDatenXstateConfig,
      prozessfuehrung: prozessfuehrungXstateConfig,
      zusammenfassung: zusammenfassungXstateConfig,
      abgabe: abgabeXstateConfig,
    },
  },
  guards: fluggastrechteGuards,
  flowTransitionConfig,
  asyncFlowActions,
} satisfies Flow;
