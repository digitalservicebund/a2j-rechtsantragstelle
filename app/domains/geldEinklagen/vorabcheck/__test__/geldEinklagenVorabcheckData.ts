import type { GeldEinklagenVorabcheckUserData } from "~/domains/geldEinklagen/vorabcheck/userData";

export const happyPathData: GeldEinklagenVorabcheckUserData = {
  forderung: "money",
  geldspanne: "above_1500",
  bereich: "shopping",
  privatperson: "yes",
  gegenseite: "privatperson",
};
