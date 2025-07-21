import type { BeratungshilfeVorabcheckUserData } from "~/domains/beratungshilfe/vorabcheck/userData";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import type { GeldEinklagenVorabcheckUserData } from "~/domains/geldEinklagen/vorabcheck/userData";
import type { BeratungshilfeFormularUserData } from "./beratungshilfe/formular";
import type { ProzesskostenhilfeFormularUserData } from "./prozesskostenhilfe/formular/userData";
import type { SchemaObject } from "./types";

type AllUserData =
  | GeldEinklagenFormularUserData
  | GeldEinklagenVorabcheckUserData
  | BeratungshilfeVorabcheckUserData
  | BeratungshilfeFormularUserData
  | FluggastrechtVorabcheckUserData
  | FluggastrechteUserData
  | ProzesskostenhilfeFormularUserData;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type AllUserDataKeys = KeysOfUnion<AllUserData>;

export const duplicateUserData = (context: SchemaObject, prefix: string) => {
  return {
    ...context,
    ...Object.fromEntries(
      Object.entries(context)
        .filter(([key]) => key !== "pageData")
        .map(([key, value]) => [`${prefix}-${key}`, value]),
    ),
  };
};
