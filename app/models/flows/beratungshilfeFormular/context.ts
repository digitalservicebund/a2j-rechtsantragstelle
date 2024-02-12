import { beratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import { beratungshilfeGrundvoraussetzungen } from "./grundvoraussetzung/context";
import { beratungshilfeRechtsproblem } from "./rechtsproblem/context";
import { beratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { beratungshilfePersoenlicheDaten } from "./persoenlicheDaten/context";
import { beratungshilfeAbgeabe } from "~/models/flows/beratungshilfeFormular/abgabe/context";

export const beratungshilfeFormularContext = {
  ...beratungshilfeAnwaltlicheVertretung,
  ...beratungshilfeGrundvoraussetzungen,
  ...beratungshilfeRechtsproblem,
  ...beratungshilfeFinanzielleAngaben,
  ...beratungshilfePersoenlicheDaten,
  ...beratungshilfeAbgeabe,
} as const;
