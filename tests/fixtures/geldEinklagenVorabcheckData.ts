import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/context";

export const happyPathData: GeldEinklagenVorabcheckContext = {
  forderung: "money",
  geldspanne: "above_1500",
  bereich: "shopping",
  privatperson: "yes",
  gegenseite: "privatperson",
};
