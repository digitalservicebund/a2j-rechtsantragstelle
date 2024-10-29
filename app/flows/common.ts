import type { ZodTypeAny } from "zod";
import type { BeratungshilfeVorabcheckContext } from "~/flows/beratungshilfe/vorabcheck/context";
import type { FluggastrechtContext } from "~/flows/fluggastrechte/formular/context";
import type { FluggastrechtVorabcheckContext } from "~/flows/fluggastrechte/vorabcheck/context";
import type { GeldEinklagenFormularContext } from "~/flows/geldEinklagen/formular/context";
import type { GeldEinklagenVorabcheckContext } from "~/flows/geldEinklagen/vorabcheck/context";
import type { BeratungshilfeFormularContext } from "./beratungshilfe/formular";
import { reasonsToDisplayBeratungshilfe } from "./beratungshilfe/vorabcheck";
import type { ProzesskostenhilfeFormularContext } from "./prozesskostenhilfe/formular";

export type AllContexts =
  | GeldEinklagenFormularContext
  | GeldEinklagenVorabcheckContext
  | BeratungshilfeVorabcheckContext
  | BeratungshilfeFormularContext
  | FluggastrechtVorabcheckContext
  | FluggastrechtContext
  | ProzesskostenhilfeFormularContext;

export type KeysOfUnion<T> = T extends T ? keyof T : never;
export type AllContextKeys = KeysOfUnion<AllContexts>;

export function getReasonsToDisplay(
  context: AllContexts,
): Record<string, boolean> {
  if ("rechtsschutzversicherung" in context) {
    return reasonsToDisplayBeratungshilfe(context);
  }
  return {};
}
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
