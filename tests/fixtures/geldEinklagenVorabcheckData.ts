import type { GeldEinklagenVorabcheckContext } from "~/flows/geldEinklagen/geldEinklagenVorabcheck/context";

export const happyPathData: GeldEinklagenVorabcheckContext = {
  forderung: "money",
  geldspanne: "above_1500",
  bereich: "shopping",
  privatperson: "yes",
  gegenseite: "privatperson",
};
