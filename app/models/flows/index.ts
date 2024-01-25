import { beratungshilfeAntrag } from "~/models/flows/beratungshilfeFormular";
import { beratungshilfeVorabcheck } from "~/models/flows/beratungshilfe";
import { geldEinklagenVorabcheck } from "~/models/flows/geldEinklagen";
import { geldEinklagenFormular } from "~/models/flows/geldEinklagenFormular";
import { fluggastrechtFlow } from "~/models/flows/fluggastrechteFormular";
import { fluggastrechteVorabcheck } from "~/models/flows/fluggastrechte";
import type {
  Config,
  Context,
  Guards,
} from "~/services/flow/server/buildFlowController";
import { type CollectionSchemas } from "~/services/cms/schemas";

export type Flow = {
  cmsSlug: keyof CollectionSchemas;
  config: Config;
  guards: Guards;
  context: Record<string, boolean | string | object | number>;
  migrationSource?: string;
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

export type FlowSpecifics = typeof flows;
export type FlowId = keyof FlowSpecifics;

export const isFlowId = (s: string): s is FlowId => s in flows;

export function flowIDFromPathname(pathname: string) {
  const flowID = [pathname.split("/")[1], pathname.split("/")[2]].join("/");
  if (isFlowId(flowID)) return flowID;
  throw Error("Unknown flow ID");
}
