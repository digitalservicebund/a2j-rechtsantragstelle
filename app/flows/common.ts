import type { ZodTypeAny } from "zod";
import type { BeratungshilfeVorabcheckContext } from "~/flows/beratungshilfeVorabcheck/context";
import type { FluggastrechtVorabcheckContext } from "~/flows/fluggastrechteVorabcheck/context";
import type { GeldEinklagenVorabcheckContext } from "~/flows/geldEinklagenVorabcheck/context";
import type { BeratungshilfeFormularContext } from "./beratungshilfeFormular";
import { reasonsToDisplayBeratungshilfe } from "./beratungshilfeVorabcheck";
import type { FluggastrechtContext } from "./fluggastrechteFormular/context";
import type { GeldEinklagenFormularContext } from "./geldEinklagenFormular/context";
import type { ProzesskostenhilfeFormularContext } from "./prozesskostenhilfeFormular";

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
