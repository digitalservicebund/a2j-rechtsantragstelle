import { beratungshilfeVorabcheck } from "app/flows/beratungshilfeVorabcheck";
import { fluggastrechteVorabcheck } from "app/flows/fluggastrechteVorabcheck";
import { geldEinklagenVorabcheck } from "app/flows/geldEinklagenVorabcheck";
import { beratungshilfeFormular } from "~/flows/beratungshilfeFormular";
import { fluggastrechtFlow } from "~/flows/fluggastrechteFormular";
import { geldEinklagenFormular } from "~/flows/geldEinklagenFormular";
import type { Translations } from "~/services/cms/index.server";
import { type CollectionSchemas } from "~/services/cms/schemas";
import type { Config } from "~/services/flow/server/buildFlowController";
import type { FlowTransitionConfig } from "~/services/session.server/flowTransitionValidation.server";
import type { Replacements } from "~/util/fillTemplate";
import type { Context } from "./contexts";
import type { FlowId } from "./flowIds";
import type { Guards } from "./guards.server";

export type Flow = {
  cmsSlug: keyof CollectionSchemas;
  config: Config;
  guards: Guards;
  migrationSource?: FlowId;
  flowTransitionConfig?: FlowTransitionConfig;
  stringReplacements?: (
    context: Context,
    translations: Translations,
  ) => Replacements;
};

export const flows = {
  "/beratungshilfe/antrag": beratungshilfeFormular,
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "/geld-einklagen/vorabcheck": geldEinklagenVorabcheck,
  "/geld-einklagen/formular": geldEinklagenFormular,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "/fluggastrechte/formular": fluggastrechtFlow,
} as const satisfies Record<FlowId, Flow>;
