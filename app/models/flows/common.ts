import { reasonsToDisplayBeratungshilfe } from "./beratungshilfeVorabcheck";
import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfeVorabcheck/context";
import type { BeratungshilfeFormularContext } from "./beratungshilfeFormular";
import type { FluggastrechtVorabcheckContext } from "~/models/flows/fluggastrechteVorabcheck/context";
import type { FluggastrechtContext } from "./fluggastrechteFormular/context";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagenVorabcheck/context";
import type { GeldEinklagenFormularContext } from "./geldEinklagenFormular/context";

export type AllContexts =
  | GeldEinklagenFormularContext
  | GeldEinklagenVorabcheckContext
  | BeratungshilfeVorabcheckContext
  | BeratungshilfeFormularContext
  | FluggastrechtVorabcheckContext
  | FluggastrechtContext;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type AllContextKeys = KeysOfUnion<AllContexts>;

export function getReasonsToDisplay(
  context: AllContexts,
): Record<string, boolean> {
  if ("rechtsschutzversicherung" in context) {
    return reasonsToDisplayBeratungshilfe(context);
  }
  return {};
}
