import type { ZodTypeAny } from "zod";
import { beratungshilfeFormularContext } from "~/domains/beratungshilfe/formular/context";
import { context as beratungshilfeContext } from "~/domains/beratungshilfe/vorabcheck/context";
import { fluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { fluggastrechteVorabcheckContext } from "~/domains/fluggastrechte/vorabcheck/context";
import { context as geldEinklagenFormularContext } from "~/domains/geldEinklagen/formular/context";
import { context as geldEinklagenContext } from "~/domains/geldEinklagen/vorabcheck/context";
import { prozesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular/context";
import type { FlowId } from "./flowIds";
import type { CompoundValidation } from "./fluggastrechte/formular/flugdaten/context";

export type BasicTypes = string | number | boolean;
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

export type Schemas = Record<string, ZodTypeAny> & {
  compoundValidations?: CompoundValidation;
};

const contexts = {
  "/beratungshilfe/antrag": beratungshilfeFormularContext,
  "/beratungshilfe/vorabcheck": beratungshilfeContext,
  "/geld-einklagen/vorabcheck": geldEinklagenContext,
  "/geld-einklagen/formular": geldEinklagenFormularContext,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheckContext,
  "/fluggastrechte/formular": fluggastrechtContext,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularContext,
} as const satisfies Record<FlowId, Schemas>;

export const getContext = (flowId: FlowId) => contexts[flowId];
