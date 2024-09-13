import { beratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import { beratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { beratungshilfeGrundvoraussetzungen } from "./grundvoraussetzung/context";
import { beratungshilfeRechtsproblem } from "./rechtsproblem/context";
import { abgabeContext } from "../shared/abgabe/context";
import { persoenlicheDaten } from "~/flows/shared/persoenlicheDaten/context";

export const beratungshilfeFormularContext = {
  ...beratungshilfeAnwaltlicheVertretung,
  ...beratungshilfeGrundvoraussetzungen,
  ...beratungshilfeRechtsproblem,
  ...beratungshilfeFinanzielleAngaben,
  ...persoenlicheDaten,
  ...abgabeContext,
} as const;
