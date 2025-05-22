import type { ZodTypeAny } from "zod";
import type { BeratungshilfeVorabcheckContext } from "~/domains/beratungshilfe/vorabcheck/context";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import type { FluggastrechtVorabcheckContext } from "~/domains/fluggastrechte/vorabcheck/context";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import type { GeldEinklagenVorabcheckUserData } from "~/domains/geldEinklagen/vorabcheck/userData";
import type { BeratungshilfeFormularContext } from "./beratungshilfe/formular";
import type { ProzesskostenhilfeFormularContext } from "./prozesskostenhilfe/formular/context";

type AllContexts =
  | GeldEinklagenFormularUserData
  | GeldEinklagenVorabcheckUserData
  | BeratungshilfeVorabcheckContext
  | BeratungshilfeFormularContext
  | FluggastrechtVorabcheckContext
  | FluggastrechtContext
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
