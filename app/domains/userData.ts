import type { ZodTypeAny } from "zod";
import { fluggastrechteInputSchema } from "~/domains/fluggastrechte/formular/userData";
import { fluggastrechteVorabcheckInputSchema } from "~/domains/fluggastrechte/vorabcheck/userData";
import { geldEinklagenInputSchema } from "~/domains/geldEinklagen/formular/userData";
import { geldEinklagenVorabcheckInputSchema } from "~/domains/geldEinklagen/vorabcheck/userData";
import { prozesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { beratungshilfeFormularUserData } from "./beratungshilfe/formular/userData";
import type { FlowId } from "./flowIds";

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
  "/beratungshilfe/vorabcheck": {}, // BH vorabcheck is using page-based config. The schemas are accessible via getPageSchema(pathname)
  "/geld-einklagen/vorabcheck": geldEinklagenVorabcheckInputSchema,
  "/geld-einklagen/formular": geldEinklagenInputSchema,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheckInputSchema,
  "/fluggastrechte/formular": fluggastrechteInputSchema,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularUserData,
  "/kontopfaendung/wegweiser": {},
} as const satisfies Record<FlowId, Record<string, ZodTypeAny>>;

export const getContext = (flowId: FlowId) => contexts[flowId];
