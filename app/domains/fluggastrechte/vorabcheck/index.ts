import type { Flow } from "~/domains/flows.server";
import fluggastrechteVorabcheckFlow from "~/domains/fluggastrechte/vorabcheck/flow.json";
import { guards as fluggastrechteVorabcheckGuards } from "~/domains/fluggastrechte/vorabcheck/guards";
import type { FluggastrechtVorabcheckContext } from "./context";
import {
  getButtonURLForClaimViaPost,
  getCompensationPaymentString,
  getEndAirportName,
  getLastDayFromFourYearsAgoDate,
  getStartAirportName,
  hasArbitrationBoardBfJ,
  hasArbitrationBoardRV,
  hasCompensationLongDistanceInsideEU,
  hasCompensationLongDistanceOutsideEU,
  hasCompensationMiddleDistance,
  hasCompensationShortDistance,
} from "./stringReplacements";
import { getResponsibleCourt } from "../formular/stringReplacements";

export const fluggastrechteVorabcheck = {
  flowType: "vorabCheck",
  config: fluggastrechteVorabcheckFlow,
  guards: fluggastrechteVorabcheckGuards,
  stringReplacements: (context: FluggastrechtVorabcheckContext) => ({
    ...getCompensationPaymentString(context),
    flightDateExpiration: getLastDayFromFourYearsAgoDate(),
    ...getStartAirportName(context),
    ...getEndAirportName(context),
    ...getResponsibleCourt(context),
    ...getButtonURLForClaimViaPost(context),
    ...hasArbitrationBoardBfJ(context),
    ...hasArbitrationBoardRV(context),
    ...hasCompensationLongDistanceInsideEU(context),
    ...hasCompensationLongDistanceOutsideEU(context),
    ...hasCompensationMiddleDistance(context),
    ...hasCompensationShortDistance(context),
  }),
} satisfies Flow;
