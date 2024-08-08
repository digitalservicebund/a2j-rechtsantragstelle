import { beratungshilfeAbgabe } from "~/flows/beratungshilfeFormular/abgabe/context";
import { beratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import { beratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { beratungshilfeGrundvoraussetzungen } from "./grundvoraussetzung/context";
import { beratungshilfePersoenlicheDaten } from "./persoenlicheDaten/context";
import { beratungshilfeRechtsproblem } from "./rechtsproblem/context";

export const beratungshilfeFormularContext = {
  ...beratungshilfeAnwaltlicheVertretung,
  ...beratungshilfeGrundvoraussetzungen,
  ...beratungshilfeRechtsproblem,
  ...beratungshilfeFinanzielleAngaben,
  ...beratungshilfePersoenlicheDaten,
  ...beratungshilfeAbgabe,
} as const;
