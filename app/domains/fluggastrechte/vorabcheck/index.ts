import type { Flow } from "~/domains/flows.server";
import { guards as fluggastrechteVorabcheckGuards } from "~/domains/fluggastrechte/vorabcheck/guards";
import { fluggastrechteVorabcheckXstateConfig } from "~/domains/fluggastrechte/vorabcheck/xstateConfig";
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
import type { FluggastrechtVorabcheckUserData } from "./userData";
import { getResponsibleCourt } from "../formular/stringReplacements/legalCourts";

export const fluggastrechteVorabcheck = {
  flowType: "vorabCheck",
  config: fluggastrechteVorabcheckXstateConfig,
  guards: fluggastrechteVorabcheckGuards,
  stringReplacements: (context: FluggastrechtVorabcheckUserData) => ({
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
