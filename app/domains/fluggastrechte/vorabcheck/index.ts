import type { Flow } from "~/domains/flows.server";
import fluggastrechteVorabcheckFlow from "~/domains/fluggastrechte/vorabcheck/flow.json";
import { guards as fluggastrechteVorabcheckGuards } from "~/domains/fluggastrechte/vorabcheck/guards";
import type { FluggastrechtVorabcheckContext } from "./context";
import {
  getCompensationPaymentString,
  getEndAirportName,
  getLastDayFromFourYearsAgoDate,
  getStartAirportName,
  hasArbitrationBoardBfJ,
  hasArbitrationBoardSoeP,
  hasCompensationLongDistanceInsideEU,
  hasCompensationLongDistanceOutsideEU,
  hasCompensationMiddleDistance,
  hasCompensationShortDistance,
} from "./stringReplacements";
import type { Context } from "../../contexts";

export const fluggastrechteVorabcheck = {
  flowType: "vorabCheck",
  config: fluggastrechteVorabcheckFlow,
  guards: fluggastrechteVorabcheckGuards,
  stringReplacements: (context: FluggastrechtVorabcheckContext) => ({
    ...getCompensationPaymentString(context),
    flightDateExpiration: getLastDayFromFourYearsAgoDate(),
    ...getStartAirportName(context),
    ...getEndAirportName(context),
    ...hasArbitrationBoardBfJ(context),
    ...hasArbitrationBoardSoeP(context),
    ...hasCompensationLongDistanceInsideEU(context),
    ...hasCompensationLongDistanceOutsideEU(context),
    ...hasCompensationMiddleDistance(context),
    ...hasCompensationShortDistance(context),
  }),
} satisfies Flow;

export const partnerCourtAirports = {
  BRE: "28199",
  BER: "12529",
  DUS: "40474",
  FRA: "60549", // eigtl 60547
  HAM: "22335",
  MUC: "85356",
  STR: "70629",
} as const;

type PartnerAirport = keyof typeof partnerCourtAirports;

export const isPartnerAirport = (
  airport: Context[string],
): airport is PartnerAirport =>
  typeof airport === "string" && airport in partnerCourtAirports;
