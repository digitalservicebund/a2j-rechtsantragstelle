import { isFinanciallyEligibleForBerH } from "~/domains/beratungshilfe/formular/abgabe/isFinanciallyEligibleForBerH";
import { getRechtsproblemStrings } from "~/domains/beratungshilfe/formular/rechtsproblem/stringReplacements";
import type { Flow } from "~/domains/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import {
  getAmtsgerichtStrings,
  getStaatlicheLeistungenStrings,
  getAnwaltStrings,
  ausgabenStrings,
  weiteresEinkommenStrings,
  getWeitereDokumenteStrings,
} from "./stringReplacements";
import type { BeratungshilfeFormularUserData } from "./userData";
import { beratungshilfeXstateConfig } from "./xstateConfig";
import {
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../../shared/formular/stringReplacements";

export const beratungshilfeFormular = {
  flowType: "formFlow",
  config: beratungshilfeXstateConfig,
  guards: {},
  stringReplacements: (context: BeratungshilfeFormularUserData) => ({
    ...getAmtsgerichtStrings(context),
    ...getStaatlicheLeistungenStrings(context),
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...getAnwaltStrings(context),
    ...getRechtsproblemStrings(context),
    ...ausgabenStrings(context),
    ...geldAnlagenStrings(context),
    ...weiteresEinkommenStrings(context),
    ...getWeitereDokumenteStrings(context),
  }),
  asyncFlowActions: {
    "/abgabe/art": (request, userData) =>
      Promise.resolve(
        sendCustomAnalyticsEvent({
          request,
          eventName: "financial eligibility calculated",
          properties: {
            isEligible: isFinanciallyEligibleForBerH(userData),
          },
        }),
      ),
  },
} satisfies Flow;
