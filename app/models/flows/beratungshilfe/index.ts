import flow from "./config.json";
import { context } from "./context";
import { guards } from "./guards";
import { getVerfuegbaresEinkommenFreibetrag } from "~/models/beratungshilfe";
import { type AllContexts } from "../common";

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
