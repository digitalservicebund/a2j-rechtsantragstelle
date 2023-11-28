import { guards as fluggastrechteVorabcheckGuards } from "~/models/flows/fluggastrechte/guards";
import fluggastrechteVorabcheckFlow from "~/models/flows/fluggastrechte/config.json";
import { fluggastrechteVorabcheckContext } from "~/models/flows/fluggastrechte/context";

export const fluggastrechteVorabcheck = {
  cmsSlug: "vorab-check-pages",
  flow: fluggastrechteVorabcheckFlow,
  guards: fluggastrechteVorabcheckGuards,
  context: fluggastrechteVorabcheckContext,
} as const;
