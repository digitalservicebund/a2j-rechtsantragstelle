import { fluggastrechteInputSchema } from "~/domains/fluggastrechte/formular/userData";
import { type FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { fluggastrechteVorabcheckInputSchema } from "~/domains/fluggastrechte/vorabcheck/userData";
import { type FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";
import { geldEinklagenInputSchema } from "~/domains/geldEinklagen/formular/userData";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { type GeldEinklagenVorabcheckUserData } from "~/domains/geldEinklagen/vorabcheck/userData";
import { geldEinklagenVorabcheckInputSchema } from "~/domains/geldEinklagen/vorabcheck/userData";
import { prozesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import type { BeratungshilfeFormularUserData } from "./beratungshilfe/formular";
import { beratungshilfeFormularUserData } from "./beratungshilfe/formular/userData";
import type { BeratungshilfeVorabcheckUserData } from "./beratungshilfe/vorabcheck/userData";
import type { FlowId } from "./flowIds";
import type { SchemaObject } from "./types";

export type BasicTypes = string | number | boolean;
export type ObjectType = {
  [key: string]: BasicTypes | BasicTypes[] | ObjectType;
};
export type ArrayData = Array<Record<string, BasicTypes>>;
export type UserData = Record<
  string,
  BasicTypes | ObjectType | ArrayData | undefined
>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type AllUserDataKeys = KeysOfUnion<
  | GeldEinklagenFormularUserData
  | GeldEinklagenVorabcheckUserData
  | BeratungshilfeVorabcheckUserData
  | BeratungshilfeFormularUserData
  | FluggastrechtVorabcheckUserData
  | FluggastrechteUserData
  | ProzesskostenhilfeFormularUserData
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
} as const satisfies Record<FlowId, SchemaObject>;

export const getContext = (flowId: FlowId) => contexts[flowId];
