import { beratungshilfeAntrag } from "~/models/flows/beratungshilfeFormular";
import { beratungshilfeVorabcheck } from "~/models/flows/beratungshilfe";
import { geldEinklagenVorabcheck } from "~/models/flows/geldEinklagen";
import { geldEinklagenFormular } from "~/models/flows/geldEinklagenFormular";
import { fluggastrechtFlow } from "~/models/flows/fluggastrechteFormular";
import { fluggastrechteVorabcheck } from "~/models/flows/fluggastrechte";
import type {
  Config,
  Guards,
} from "~/services/flow/server/buildFlowController";
import { type CollectionSchemas } from "~/services/cms/schemas";
import type { FlowId, Context } from "./contexts";

export type Flow = {
  cmsSlug: keyof CollectionSchemas;
  config: Config;
  guards: Guards;
  migrationSource?: FlowId;
  stringReplacements?: (context: Context) => Record<string, string | undefined>;
};

export const flows = {
  "beratungshilfe/antrag": beratungshilfeAntrag,
  "beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "geld-einklagen/vorabcheck": geldEinklagenVorabcheck,
  "geld-einklagen/formular": geldEinklagenFormular,
  "fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "fluggastrechte/formular": fluggastrechtFlow,
} as const satisfies Record<string, Flow>;

export function getSubflowsEntries(config: Config) {
  if (!config.states) return [];
  return Object.entries(config.states).filter(([, state]) => "states" in state);
}
