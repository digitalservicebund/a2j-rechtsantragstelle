import type { ZodTypeAny } from "zod";
import { fluggastrechteInputSchema } from "~/domains/fluggastrechte/formular/userData";
import { fluggastrechteVorabcheckInputSchema } from "~/domains/fluggastrechte/vorabcheck/userData";
import { geldEinklagenInputSchema } from "~/domains/geldEinklagen/formular/userData";
import { geldEinklagenVorabcheckInputSchema } from "~/domains/geldEinklagen/vorabcheck/userData";
import { prozesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { beratungshilfeFormularUserData } from "./beratungshilfe/formular/userData";
import type { FlowId } from "./flowIds";
import { kontopfaendungWegweiserInputSchema } from "./kontopfaendung/wegweiser/userData";

export type BasicTypes = string | number | boolean;
export type ObjectType = {
  [key: string]: BasicTypes | BasicTypes[] | ObjectType;
};
export type ArrayData = Array<Record<string, BasicTypes>>;
export type UserData = Record<
  string,
  BasicTypes | ObjectType | ArrayData | undefined
>;

const contexts = {
  "/beratungshilfe/antrag": beratungshilfeFormularUserData,
  "/beratungshilfe/vorabcheck": {}, // schemas for BH vorabcheck have moved page-based config, see /beratungshilfe/vorabcheck/pages.ts
  "/geld-einklagen/vorabcheck": geldEinklagenVorabcheckInputSchema,
  "/geld-einklagen/formular": geldEinklagenInputSchema,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheckInputSchema,
  "/fluggastrechte/formular": fluggastrechteInputSchema,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularUserData,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiserInputSchema,
} as const satisfies Record<FlowId, Record<string, ZodTypeAny>>;

export const getContext = (flowId: FlowId) => contexts[flowId];
