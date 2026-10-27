import type { Flow } from "~/domains/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getVerfuegbaresEinkommenFreibetrag } from "./freibetrag";
import { type BeratungshilfeVorabcheckUserData } from "./userData";
import { beratungshilfeVorabcheckFlowConfig } from "./flowConfig";

export const beratungshilfeVorabcheck = {
  flowType: "vorabCheck",
  stringReplacements: (context: BeratungshilfeVorabcheckUserData) => ({
    verfuegbaresEinkommenFreibetrag:
      getVerfuegbaresEinkommenFreibetrag(context).toString(),
  }),
  config: beratungshilfeVorabcheckFlowConfig,
  posFlowActions: {
    "/bereich": (request, userData: BeratungshilfeVorabcheckUserData) =>
      Promise.resolve(
        sendCustomAnalyticsEvent({
          request,
          eventName: "beratungshilfe vorabcheck bereich submitted",
          properties: { bereich: userData.bereich },
        }),
      ),
  },
} satisfies Flow;
