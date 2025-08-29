import type { z } from "zod";
import { fluggastrechteInputSchema } from "~/domains/fluggastrechte/formular/userData";
import { type FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { fluggastrechteVorabcheckInputSchema } from "~/domains/fluggastrechte/vorabcheck/userData";
import { type FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { type BeratungshilfeFormularUserData } from "./beratungshilfe/formular/userData";
import type { BeratungshilfeVorabcheckUserData } from "./beratungshilfe/vorabcheck/userData";
import type { FlowId } from "./flowIds";

export type BasicTypes = string | number | boolean;
type ObjectType = {
  [key: string]: BasicTypes | BasicTypes[] | ObjectType;
};
export type ArrayData = Array<Record<string, BasicTypes>>;
export type AllowedUserTypes = BasicTypes | ObjectType | ArrayData | undefined;

export type SchemaObject = Record<string, z.ZodType<AllowedUserTypes>>;
export type UserData = Record<string, AllowedUserTypes>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type AllUserDataKeys = KeysOfUnion<
  | BeratungshilfeVorabcheckUserData
  | BeratungshilfeFormularUserData
  | FluggastrechtVorabcheckUserData
  | FluggastrechteUserData
  | ProzesskostenhilfeFormularUserData
>;

const contexts = {
  "/beratungshilfe/antrag": {},
  "/beratungshilfe/vorabcheck": {}, // BH vorabcheck is using page-based config. The schemas are accessible via getPageSchema(pathname)
  "/geld-einklagen/vorabcheck": {},
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheckInputSchema,
  "/fluggastrechte/formular": fluggastrechteInputSchema,
  "/prozesskostenhilfe/formular": {},
  "/kontopfaendung/wegweiser": {},
} as const satisfies Record<FlowId, SchemaObject>;

export const getContext = (flowId: FlowId) => contexts[flowId];
