import type { GeldEinklagenVorabcheckContext } from "~/domains/geldEinklagen/vorabcheck/context";

export const happyPathData: GeldEinklagenVorabcheckContext = {
  forderung: "money",
  geldspanne: "above_1500",
  bereich: "shopping",
  privatperson: "yes",
  gegenseite: "privatperson",
};
