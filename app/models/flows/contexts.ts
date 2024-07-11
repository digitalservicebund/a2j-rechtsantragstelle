import type { ZodTypeAny } from "zod";
import { context as beratungshilfeContext } from "~/models/flows/beratungshilfeVorabcheck/context";
import { beratungshilfeFormularContext } from "./beratungshilfeFormular/context";
import type { FlowId } from "./flowIds";
import { fluggastrechteVorabcheckContext } from "~/models/flows/fluggastrechteVorabcheck/context";
import { fluggastrechtContext } from "./fluggastrechteFormular/context";
import { context as geldEinklagenContext } from "~/models/flows/geldEinklagenVorabcheck/context";
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

const contexts = {
  "beratungshilfe/antrag": beratungshilfeFormularContext,
  "beratungshilfe/vorabcheck": beratungshilfeContext,
  "geld-einklagen/vorabcheck": geldEinklagenContext,
  "geld-einklagen/formular": geldEinklagenFormularContext,
  "fluggastrechte/vorabcheck": fluggastrechteVorabcheckContext,
  "fluggastrechte/formular": fluggastrechtContext,
} as const satisfies Record<FlowId, Record<string, ZodTypeAny>>;

export const getContext = (flowId: FlowId) => contexts[flowId];
