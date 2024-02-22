import { reasonsToDisplayBeratungshilfe } from "./beratungshilfe";
import type { GeldEinklagenFormularContext } from "./geldEinklagenFormular/context";
import type { GeldEinklagenVorabcheckContext } from "./geldEinklagen/context";
import type { BeratungshilfeVorabcheckContext } from "./beratungshilfe/context";
import type { FluggastrechtContext } from "./fluggastrechteFormular/context";
import type { BeratungshilfeFormularContext } from "./beratungshilfeFormular";

export type AllContexts =
  | GeldEinklagenFormularContext
  | GeldEinklagenVorabcheckContext
  | BeratungshilfeVorabcheckContext
  | BeratungshilfeFormularContext
  | FluggastrechtContext;

export function getReasonsToDisplay(
  context: AllContexts,
): Record<string, boolean> {
  if ("rechtsschutzversicherung" in context) {
    return reasonsToDisplayBeratungshilfe(context);
  }
  return {};
}
