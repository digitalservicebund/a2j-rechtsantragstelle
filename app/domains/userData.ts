import type { z } from "zod";
import { type FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { type FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { type BeratungshilfeFormularUserData } from "./beratungshilfe/formular/userData";
import type { BeratungshilfeVorabcheckUserData } from "./beratungshilfe/vorabcheck/userData";
import { type KontopfaendungWegweiserUserData } from "~/domains/kontopfaendung/wegweiser/userData";
import type { KontopfaendungPkontoAntragUserData } from "./kontopfaendung/pkonto/antrag/userData";
import type { ErbscheinNachlassGerichtUserData } from "./erbschein/nachlassgericht/userData";
import type { ErbscheinWegweiserUserData } from "./erbschein/wegweiser/userData";

export type BasicTypes = string | number | boolean | undefined;
export type ObjectType = {
  [key: string]: BasicTypes | BasicTypes[] | ObjectType;
};
export type ArrayData = Array<Record<string, BasicTypes>>;
type PageSchemaTypes = BasicTypes | ObjectType | ArrayData | undefined;
export type AllowedUserTypes = ArrayData | PageSchemaTypes;
export type ArraySchema = Record<string, z.ZodType<ArrayData>>;
export type SchemaObject = Record<string, z.ZodType<PageSchemaTypes>>;
export type UserData = Record<string, AllowedUserTypes>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type AllUserDataKeys = KeysOfUnion<
  | BeratungshilfeVorabcheckUserData
  | BeratungshilfeFormularUserData
  | FluggastrechtVorabcheckUserData
  | FluggastrechteUserData
  | ProzesskostenhilfeFormularUserData
  | KontopfaendungWegweiserUserData
  | KontopfaendungPkontoAntragUserData
  | ErbscheinWegweiserUserData
  | ErbscheinNachlassGerichtUserData
>;
