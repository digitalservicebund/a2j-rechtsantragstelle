import invariant from "tiny-invariant";
import type { Params } from "@remix-run/react";
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
} from "~/services/flow/buildFlowController";
import { type CollectionSchemas } from "~/services/cms/schemas";

type FlowConfig = {
  cmsSlug: keyof CollectionSchemas;
  flow: Config;
  guards: Guards;
  context: Record<string, boolean | string | object | number>;
  migrationSource?: string;
  stringReplacements?: (context: Context) => Record<string, string | undefined>;
};

export const flowSpecifics = {
  "beratungshilfe/antrag": beratungshilfeAntrag,
  "beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "geld-einklagen/vorabcheck": geldEinklagenVorabcheck,
  "geld-einklagen/formular": geldEinklagenFormular,
  "fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "fluggastrechte/formular": fluggastrechtFlow,
} as const satisfies Record<string, FlowConfig>;

export function getSubflowsEntries(flow: FlowConfig["flow"]) {
  if (!flow.states) return [];
  return Object.entries(flow.states).filter(([_, state]) => "states" in state);
}

export type FlowSpecifics = typeof flowSpecifics;
export type FlowId = keyof FlowSpecifics;

export function flowIDFromPathname(pathname: string) {
  const flowID = [pathname.split("/")[1], pathname.split("/")[2]].join("/");
  if (!(flowID in flowSpecifics)) throw Error("Unknown flow ID");
  return flowID as FlowId;
}

export function splatFromParams(params: Params) {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");
  return splat;
}

export function parentFromParams(pathname: string, params: Params) {
  const splat = params["*"];
  invariant(splat && pathname.endsWith(splat));
  return pathname.slice(0, -splat.length - 1);
}
