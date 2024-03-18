import { beratungshilfeFormular } from "~/models/flows/beratungshilfeFormular";
import { beratungshilfeVorabcheck } from "~/models/flows/beratungshilfe";
import { geldEinklagenVorabcheck } from "~/models/flows/geldEinklagen";
import { geldEinklagenFormular } from "~/models/flows/geldEinklagenFormular";
import { fluggastrechtFlow } from "~/models/flows/fluggastrechteFormular";
import { fluggastrechteVorabcheck } from "~/models/flows/fluggastrechte";
import type { Config } from "~/services/flow/server/buildFlowController";
import { type CollectionSchemas } from "~/services/cms/schemas";
import type { FlowId, Context } from "./contexts";
import type { Guards } from "./guards.server";
import type { ArrayConfig } from "~/services/array";

export type Flow = {
  cmsSlug: keyof CollectionSchemas;
  config: Config;
  guards: Guards;
  migrationSource?: FlowId;
  stringReplacements?: (context: Context) => Record<string, string | undefined>;
  arrayConfigurations?: Record<string, ArrayConfig>;
};

export const flows = {
  "beratungshilfe/antrag": beratungshilfeFormular,
  "beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "geld-einklagen/vorabcheck": geldEinklagenVorabcheck,
  "geld-einklagen/formular": geldEinklagenFormular,
  "fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "fluggastrechte/formular": fluggastrechtFlow,
} as const satisfies Record<FlowId, Flow>;

export function getSubflowsEntries(config: Config) {
  if (!config.states) return [];
  return Object.entries(config.states).filter(([, state]) => "states" in state);
}
