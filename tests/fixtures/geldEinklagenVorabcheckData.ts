import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";

export const happyPathData: GeldEinklagenVorabcheckContext = {
  kontaktaufnahme: "yes",
  fristAbgelaufen: "yes",
  privatperson: "yes",
  bundIdAccount: "yes",
  forderung: "lessOrEqual5000",
  bereich: "shopping",
  gegenseite: "privatperson",
  gegenseitePersonDeutschland: "yes",
};
