import type { z } from "zod";
import { fluggastrechteInputSchema } from "~/domains/fluggastrechte/formular/userData";
import { type FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { type FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { type BeratungshilfeFormularUserData } from "./beratungshilfe/formular/userData";
import type { BeratungshilfeVorabcheckUserData } from "./beratungshilfe/vorabcheck/userData";
import type { FlowId } from "./flowIds";
import { type KontopfaendungWegweiserUserData } from "~/domains/kontopfaendung/wegweiser/userData";

export type BasicTypes = string | number | boolean | undefined;
type ObjectType = {
  // oxlint-disable-next-line @typescript-eslint/consistent-indexed-object-style
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
  | KontopfaendungWegweiserUserData
>;

const contexts = {
  "/beratungshilfe/antrag": {},
  "/beratungshilfe/vorabcheck": {}, // BH vorabcheck is using page-based config. The schemas are accessible via getPageSchema(pathname)
  "/fluggastrechte/vorabcheck": {},
  "/fluggastrechte/formular": fluggastrechteInputSchema,
  "/prozesskostenhilfe/formular": {},
  "/kontopfaendung/wegweiser": {},
  "/geld-einklagen/formular": {},
} as const satisfies Record<FlowId, SchemaObject>;

export const getContext = (flowId: FlowId) => contexts[flowId];
