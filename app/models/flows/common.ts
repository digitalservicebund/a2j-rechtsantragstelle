import { reasonsToDisplayBeratungshilfe } from "./beratungshilfe";
import type { GeldEinklagenFormularContext } from "./geldEinklagenFormular/context";
import type { GeldEinklagenVorabcheckContext } from "./geldEinklagen/context";
import type { BeratungshilfeVorabcheckContext } from "./beratungshilfe/context";
import type { FluggastrechtContext } from "./fluggastrechteFormular/context";
import type { BeratungshilfeFormularContext } from "./beratungshilfeFormular";
import type { FluggastrechtVorabcheckContext } from "./fluggastrechte/context";

export type AllContexts =
  | GeldEinklagenFormularContext
  | GeldEinklagenVorabcheckContext
  | BeratungshilfeVorabcheckContext
  | BeratungshilfeFormularContext
  | FluggastrechtVorabcheckContext
  | FluggastrechtContext;

export function getReasonsToDisplay(
  context: AllContexts,
): Record<string, boolean> {
  if ("rechtsschutzversicherung" in context) {
    return reasonsToDisplayBeratungshilfe(context);
  }
  return {};
}
