import type { Flow } from "~/flows/flows.server";
import fluggastrechteVorabcheckFlow from "~/flows/fluggastrechteVorabcheck/flow.json";
import { guards as fluggastrechteVorabcheckGuards } from "~/flows/fluggastrechteVorabcheck/guards";
import type { Translations } from "~/services/cms/index.server";
import type { FluggastrechtVorabcheckContext } from "./context";
import {
  getCompensantionPaymentString,
  getEndAirportName,
  getLastDaytFromFourYearsAgoDate,
  getRouteCompensationDescription,
  getStartAirportName,
  hasArbitrationBoardBfJ,
  hasArbitrationBoardSoeP,
} from "./stringReplacements";
import type { Context } from "../contexts";

export const fluggastrechteVorabcheck = {
  cmsSlug: "vorab-check-pages",
  config: fluggastrechteVorabcheckFlow,
  guards: fluggastrechteVorabcheckGuards,
  stringReplacements: (
    context: FluggastrechtVorabcheckContext,
    translations: Translations,
  ) => ({
    ...getCompensantionPaymentString(context),
    flightDateExpiration: getLastDaytFromFourYearsAgoDate(),
    ...getStartAirportName(context),
    ...getEndAirportName(context),
    ...getRouteCompensationDescription(context, translations),
    ...hasArbitrationBoardBfJ(context),
    ...hasArbitrationBoardSoeP(context),
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
