import type { Flow } from "~/domains/flows.server";
import type { FlowTransitionConfig } from "~/services/flow/server/flowTransitionValidation";
import { isTotalClaimWillSucceddedAboveLimit } from "./services/isTotalClaimAboveLimit";
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
} from "./stringReplacements/person";
import type { FluggastrechteUserData } from "./userData";
import { fluggastrechteFormularFlowConfig } from "./flowConfig";

const flowTransitionConfig: FlowTransitionConfig = {
  sourceFlowId: "/fluggastrechte/vorabcheck",
  eligibleSourcePages: ["/ergebnis/erfolg"],
};

export const fluggastrechtFlow = {
  flowType: "formFlow",
  config: {
    id: "/fluggastrechte/formular",
    states: {},
  },
  newEngineConfig: fluggastrechteFormularFlowConfig,
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
  flowTransitionConfig,
} satisfies Flow;
