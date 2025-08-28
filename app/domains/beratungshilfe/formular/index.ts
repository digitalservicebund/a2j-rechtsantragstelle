import { isFinanciallyEligibleForBerH } from "~/domains/beratungshilfe/formular/abgabe/isFinanciallyEligibleForBerH";
import { getRechtsproblemStrings } from "~/domains/beratungshilfe/formular/rechtsproblem/stringReplacements";
import type { Flow } from "~/domains/flows.server";
import {
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "~/domains/shared/formular/stringReplacements";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { readyForValidationKey } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
import { getSessionManager } from "~/services/session.server";
import {
  getAmtsgerichtStrings,
  getStaatlicheLeistungenStrings,
  getAnwaltStrings,
  getMissingInformationStrings,
  ausgabenStrings,
  weiteresEinkommenStrings,
  getWeitereDokumenteStrings,
} from "./stringReplacements";
import type { BeratungshilfeFormularUserData } from "./userData";
import { beratungshilfeXstateConfig } from "./xstateConfig";

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
    ...getMissingInformationStrings(context),
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
    "/weitere-angaben": async (request) => {
      const { getSession, commitSession } = getSessionManager(
        "/beratungshilfe/antrag",
      );
      const session = await getSession(request.headers.get("Cookie"));
      session.set(readyForValidationKey, true);
      await commitSession(session);
    },
  },
} satisfies Flow;
