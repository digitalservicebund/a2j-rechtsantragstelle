import config from "./config.json";
import { guards, isIncomeTooHigh } from "./guards";
import { getVerfuegbaresEinkommenFreibetrag } from "./freibetrag";
import { type AllContexts } from "../common";

export function reasonsToDisplayBeratungshilfe(context: AllContexts) {
  return {
    eigeninitiativeWarning:
      "eigeninitiative" in context && context.eigeninitiative === "no",
    incomeTooHigh:
      "verfuegbaresEinkommen" in context &&
      (context.verfuegbaresEinkommen === "yes" || isIncomeTooHigh({ context })),
  };
}

export const beratungshilfeVorabcheck = {
  cmsSlug: "vorab-check-pages",
  stringReplacements: (context: AllContexts) => ({
    verfuegbaresEinkommenFreibetrag:
      getVerfuegbaresEinkommenFreibetrag(context).toString(),
  }),
  config,
  guards,
} as const;
