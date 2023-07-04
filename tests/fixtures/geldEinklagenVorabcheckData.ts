import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";

export const happyPathData: GeldEinklagenVorabcheckContext = {
  gerichtskostenvorschuss: "yes",
  forderung: "lessOrEqual5000",
  bereich: "shopping",
  gegenseite: "privatperson",
  kontaktaufnahme: "yes",
  fristAbgelaufen: "yes",
  privatperson: "yes",
  bundIdAccount: "yes",
};
