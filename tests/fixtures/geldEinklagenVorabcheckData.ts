import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagenVorabcheck/context";

export const happyPathData: GeldEinklagenVorabcheckContext = {
  forderung: "money",
  geldspanne: "above_1500",
  bereich: "shopping",
  privatperson: "yes",
  gegenseite: "privatperson",
};
