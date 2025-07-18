import type { Flow } from "~/domains/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getVerfuegbaresEinkommenFreibetrag } from "./freibetrag";
import { type BeratungshilfeVorabcheckUserData } from "./userData";
import { beratungshilfeVorabcheckXstateConfig } from "./xstateConfig";

export const beratungshilfeVorabcheck = {
  flowType: "vorabCheck",
  stringReplacements: (context: BeratungshilfeVorabcheckUserData) => ({
    verfuegbaresEinkommenFreibetrag:
      getVerfuegbaresEinkommenFreibetrag(context).toString(),
  }),
  config: beratungshilfeVorabcheckXstateConfig,
  guards: {},
  asyncFlowActions: {
    "/bereich": (request, userData) =>
      Promise.resolve(
        sendCustomAnalyticsEvent({
          request,
          eventName: "beratungshilfe vorabcheck bereich submitted",
          properties: userData,
        }),
      ),
  },
} satisfies Flow;
