import type { ZodTypeAny } from "zod";
import { beratungshilfeFormularContext } from "~/domains/beratungshilfe/formular/context";
import { context as beratungshilfeContext } from "~/domains/beratungshilfe/vorabcheck/context";
import { fluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { fluggastrechteVorabcheckContext } from "~/domains/fluggastrechte/vorabcheck/context";
import { context as geldEinklagenFormularContext } from "~/domains/geldEinklagen/formular/context";
import { context as geldEinklagenContext } from "~/domains/geldEinklagen/vorabcheck/context";
import { prozesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular/context";
import type { FlowId } from "./flowIds";
import { kontopfaendungWegweiserInputSchema } from "./kontopfaendung/wegweiser/userData";

export type BasicTypes = string | number | boolean;
export type ObjectType = {
  [key: string]: BasicTypes | BasicTypes[] | ObjectType;
};
export type ArrayData = Array<Record<string, BasicTypes>>;
export type Context = Record<
  string,
  BasicTypes | ObjectType | ArrayData | undefined
>;

const contexts = {
  "/beratungshilfe/antrag": beratungshilfeFormularContext,
  "/beratungshilfe/vorabcheck": beratungshilfeContext,
  "/geld-einklagen/vorabcheck": geldEinklagenContext,
  "/geld-einklagen/formular": geldEinklagenFormularContext,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheckContext,
  "/fluggastrechte/formular": fluggastrechtContext,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularContext,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiserInputSchema,
} as const satisfies Record<FlowId, Record<string, ZodTypeAny>>;

export const getContext = (flowId: FlowId) => contexts[flowId];
