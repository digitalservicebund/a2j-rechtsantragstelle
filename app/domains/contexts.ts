import type { ZodTypeAny } from "zod";
import { context as beratungshilfeContext } from "~/domains/beratungshilfe/vorabcheck/context";
import { fluggastrechteInputSchema } from "~/domains/fluggastrechte/formular/userData";
import { fluggastrechteVorabcheckContext } from "~/domains/fluggastrechte/vorabcheck/context";
import { context as geldEinklagenFormularContext } from "~/domains/geldEinklagen/formular/context";
import { context as geldEinklagenContext } from "~/domains/geldEinklagen/vorabcheck/context";
import { context as kontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";
import { prozesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular/context";
import { beratungshilfeFormularUserData } from "./beratungshilfe/formular/userData";
import type { FlowId } from "./flowIds";

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
  "/beratungshilfe/antrag": beratungshilfeFormularUserData,
  "/beratungshilfe/vorabcheck": beratungshilfeContext,
  "/geld-einklagen/vorabcheck": geldEinklagenContext,
  "/geld-einklagen/formular": geldEinklagenFormularContext,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheckContext,
  "/fluggastrechte/formular": fluggastrechteInputSchema,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularContext,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiserContext,
} as const satisfies Record<FlowId, Record<string, ZodTypeAny>>;

export const getContext = (flowId: FlowId) => contexts[flowId];
