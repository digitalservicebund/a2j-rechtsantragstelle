import flow from "./config.json";
import { type BeratungshilfeVorabcheckContext, context } from "./context";
import { guards, isIncomeTooHigh } from "./guards";
import { getVerfuegbaresEinkommenFreibetrag } from "./freibetrag";
import { type AllContexts } from "../common";

function isBeratungshilfeVorabcheckContext(
  context: AllContexts,
): context is BeratungshilfeVorabcheckContext {
  return "rechtsschutzversicherung" in context;
}

export function reasonsToDisplayBeratungshilfe(context: AllContexts) {
  if (!isBeratungshilfeVorabcheckContext(context)) return {};
  return {
    eigeninitiativeWarning: context.eigeninitiative === "no",
    incomeTooHigh:
      context.verfuegbaresEinkommen === "yes" || isIncomeTooHigh(context),
  };
}

export const beratungshilfeVorabcheck = {
  cmsSlug: "vorab-check-pages",
  stringReplacements: (context: AllContexts) => ({
    verfuegbaresEinkommenFreibetrag:
      getVerfuegbaresEinkommenFreibetrag(context).toString(),
  }),
  flow,
  guards,
  context,
} as const;
