import type { ZodTypeAny } from "zod";
import { context as beratungshilfeContext } from "./beratungshilfe/context";
import { beratungshilfeFormularContext } from "./beratungshilfeFormular/context";
import { fluggastrechteVorabcheckContext } from "./fluggastrechte/context";
import { fluggastrechtContext } from "./fluggastrechteFormular/context";
import { context as geldEinklagenContext } from "./geldEinklagen/context";
import { context as geldEinklagenFormularContext } from "./geldEinklagenFormular/context";

type BasicTypes = string | number | boolean;
export type ArrayData = Array<Record<string, BasicTypes>>;
export type ObjectType = Record<
  string,
  | BasicTypes
  | BasicTypes[]
  | Record<string, BasicTypes | Record<string, BasicTypes>> // TODO: check whether GeldEinklagenFormularContext should be triple nested
>;
export type Context = Record<
  string,
  BasicTypes | ObjectType | ArrayData | undefined
>;

export const flowIds = [
  "beratungshilfe/antrag",
  "beratungshilfe/vorabcheck",
  "geld-einklagen/vorabcheck",
  "geld-einklagen/formular",
  "fluggastrechte/vorabcheck",
  "fluggastrechte/formular",
] as const;

export type FlowId = (typeof flowIds)[number];

const contexts = {
  "beratungshilfe/antrag": beratungshilfeFormularContext,
  "beratungshilfe/vorabcheck": beratungshilfeContext,
  "geld-einklagen/vorabcheck": geldEinklagenContext,
  "geld-einklagen/formular": geldEinklagenFormularContext,
  "fluggastrechte/vorabcheck": fluggastrechteVorabcheckContext,
  "fluggastrechte/formular": fluggastrechtContext,
} as const satisfies Record<FlowId, Record<string, ZodTypeAny>>;

export const getContext = (flowId: FlowId) => contexts[flowId];

const isFlowId = (s: string): s is FlowId => s in contexts;

export function flowIDFromPathname(pathname: string) {
  const flowID = [pathname.split("/")[1], pathname.split("/")[2]].join("/");
  if (isFlowId(flowID)) return flowID;
  throw Error("Unknown flow ID");
}
export function parsePathname(pathname: string) {
  const pathSegments = pathname.split("/");
  const flowId = `${pathSegments[1]}/${pathSegments[2]}`;
  if (!isFlowId(flowId)) throw Error("Unknown flow ID");
  const arrayIndexes =
    pathname
      .match(/(\/\d+)/g)
      ?.map((index) => Number(index.replace("/", ""))) ?? [];
  const stepId = pathSegments
    .slice(3)
    .join("/")
    .replaceAll(/(\/\d+)/g, "");
  return { flowId, stepId, arrayIndexes };
}
