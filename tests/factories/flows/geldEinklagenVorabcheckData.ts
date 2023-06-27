import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";

export const happyPathData: GeldEinklagenVorabcheckContext = {
  kontaktaufnahme: "yes",
  fristAbgelaufen: "yes",
  verjaehrt: "no",
  beweise: "yes",
  gerichtsentscheidung: "no",
  verfahrenBegonnen: "no",
  privatperson: "yes",
  wohnsitzDeutschland: "yes",
  forderung: "lessOrEqual5000",
  bereich: "shopping",
  gegenseite: "privatperson",
  gegenseitePersonDeutschland: "yes",
};
