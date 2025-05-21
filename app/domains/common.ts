import type { ZodTypeAny } from "zod";
import type { BeratungshilfeVorabcheckUserData } from "~/domains/beratungshilfe/vorabcheck/userData";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FluggastrechtVorabcheckContext } from "~/domains/fluggastrechte/vorabcheck/context";
import type { GeldEinklagenFormularContext } from "~/domains/geldEinklagen/formular/context";
import type { GeldEinklagenVorabcheckContext } from "~/domains/geldEinklagen/vorabcheck/context";
import type { BeratungshilfeFormularUserData } from "./beratungshilfe/formular";
import type { ProzesskostenhilfeFormularContext } from "./prozesskostenhilfe/formular/context";

type AllContexts =
  | GeldEinklagenFormularContext
  | GeldEinklagenVorabcheckContext
  | BeratungshilfeVorabcheckUserData
  | BeratungshilfeFormularUserData
  | FluggastrechtVorabcheckContext
  | FluggastrechteUserData
  | ProzesskostenhilfeFormularContext;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type AllContextKeys = KeysOfUnion<AllContexts>;

export const duplicateContext = (
  context: Record<string, ZodTypeAny>,
  prefix: string,
) => {
  return {
    ...context,
    ...Object.fromEntries(
      Object.entries(context)
        .filter(([key]) => key !== "pageData")
        .map(([key, value]) => [`${prefix}-${key}`, value]),
    ),
  };
};
