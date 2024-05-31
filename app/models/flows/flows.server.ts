import { beratungshilfeVorabcheck } from "~/models/flows/beratungshilfe";
import { beratungshilfeFormular } from "~/models/flows/beratungshilfeFormular";
import { fluggastrechteVorabcheck } from "~/models/flows/fluggastrechte";
import { fluggastrechtFlow } from "~/models/flows/fluggastrechteFormular";
import { geldEinklagenVorabcheck } from "~/models/flows/geldEinklagen";
import { geldEinklagenFormular } from "~/models/flows/geldEinklagenFormular";
import type { Translations } from "~/services/cms/index.server";
import { type CollectionSchemas } from "~/services/cms/schemas";
import type { Config } from "~/services/flow/server/buildFlowController";
import type { Replacements } from "~/util/fillTemplate";
import type { FlowId, Context } from "./contexts";
import type { Guards } from "./guards.server";

export type Flow = {
  cmsSlug: keyof CollectionSchemas;
  config: Config;
  guards: Guards;
  migrationSource?: FlowId;
  stringReplacements?: (
    context: Context,
    translations: Translations,
  ) => Replacements;
};

export const flows = {
  "beratungshilfe/antrag": beratungshilfeFormular,
  "beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "geld-einklagen/vorabcheck": geldEinklagenVorabcheck,
  "geld-einklagen/formular": geldEinklagenFormular,
  "fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "fluggastrechte/formular": fluggastrechtFlow,
} as const satisfies Record<FlowId, Flow>;
