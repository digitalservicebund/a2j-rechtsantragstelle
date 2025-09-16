import type { Flow } from "~/domains/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getVerfuegbaresEinkommenFreibetrag } from "./freibetrag";
import { type BeratungshilfeVorabcheckUserData } from "./userData";
import { beratungshilfeVorabcheckXstateConfig } from "./xstateConfig";
import { beratungshilfeVorabcheckTestCases } from "~/domains/beratungshilfe/vorabcheck/__test__/testcasesWithUserInputs";

export const beratungshilfeVorabcheck = {
  flowType: "vorabCheck",
  stringReplacements: (context: BeratungshilfeVorabcheckUserData) => ({
    verfuegbaresEinkommenFreibetrag:
      getVerfuegbaresEinkommenFreibetrag(context).toString(),
  }),
  config: beratungshilfeVorabcheckXstateConfig,
  testcases: beratungshilfeVorabcheckTestCases,
  guards: {},
  asyncFlowActions: {
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
