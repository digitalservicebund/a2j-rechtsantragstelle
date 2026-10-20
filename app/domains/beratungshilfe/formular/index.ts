import { isFinanciallyEligibleForBerH } from "~/domains/beratungshilfe/formular/abgabe/isFinanciallyEligibleForBerH";
import type { Flow } from "~/domains/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getBeratungshilfeStringReplacements } from "./stringReplacements";
import type { BeratungshilfeFormularUserData } from "./userData";
import { beratungshilfeFormularFlowConfig } from "./flowConfig";
import { beratungshilfePdfFromUserdata } from "../services/pdf";

export const beratungshilfeFormular = {
  flowType: "formFlow",
  config: beratungshilfeFormularFlowConfig,
  metaConfiguration: {
    "/abgabe": { excludedFromValidation: true },
    "/abgabe/ueberpruefung": { triggerValidation: true },
  },
  stringReplacements: getBeratungshilfeStringReplacements,
  posFlowActions: {
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
  pdfConfig: {
    pdfFunction: async (userData: BeratungshilfeFormularUserData) =>
      await beratungshilfePdfFromUserdata(userData),
    name: `Antrag_Beratungshilfe`,
  },
} satisfies Flow;
