import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";

export const happyPathData: GeldEinklagenVorabcheckContext = {
  gerichtskostenvorschuss: "yes",
  forderung: "money",
  bereich: "shopping",
  gegenseite: "privatperson",
  kontaktaufnahme: "yes",
  fristAbgelaufen: "yes",
  privatperson: "yes",
  bundIdAccount: "yes",
};
