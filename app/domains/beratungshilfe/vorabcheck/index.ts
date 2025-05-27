import type { Flow } from "~/domains/flows.server";
import { getVerfuegbaresEinkommenFreibetrag } from "./freibetrag";
import { isIncomeTooHigh } from "./isIncomeTooHigh";
import { type BeratungshilfeVorabcheckUserData } from "./userData";
import { beratungshilfeVorabcheckXstateConfig } from "./xstateConfig";

export function reasonsToDisplayBeratungshilfe(
  context: BeratungshilfeVorabcheckUserData,
) {
  const shortPathIncomeTooHigh =
    "genauigkeit" in context &&
    context.genauigkeit == "no" &&
    "verfuegbaresEinkommen" in context &&
    context.verfuegbaresEinkommen === "yes";
  const longPathIncomeTooHigh =
    "genauigkeit" in context &&
    context.genauigkeit == "yes" &&
    isIncomeTooHigh({ context });
  return {
    eigeninitiativeWarning:
      "eigeninitiative" in context && context.eigeninitiative === "no",
    incomeTooHigh: shortPathIncomeTooHigh || longPathIncomeTooHigh,
  };
}

export const beratungshilfeVorabcheck = {
  flowType: "vorabCheck",
  stringReplacements: (context: BeratungshilfeVorabcheckUserData) => ({
    verfuegbaresEinkommenFreibetrag:
      getVerfuegbaresEinkommenFreibetrag(context).toString(),
  }),
  config: beratungshilfeVorabcheckXstateConfig,
  guards: {},
} satisfies Flow;
