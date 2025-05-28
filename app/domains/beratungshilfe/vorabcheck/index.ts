import type { Flow } from "~/domains/flows.server";
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
} satisfies Flow;
