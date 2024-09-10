import { finanzielleAngabenPartnerContext } from "~/flows/shared/finanzielleAngaben/partner/context";
import { beratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import { beratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { beratungshilfeGrundvoraussetzungen } from "./grundvoraussetzung/context";
import { beratungshilfePersoenlicheDaten } from "./persoenlicheDaten/context";
import { beratungshilfeRechtsproblem } from "./rechtsproblem/context";
import { abgabeContext } from "../shared/abgabe/context";

export const beratungshilfeFormularContext = {
  ...beratungshilfeAnwaltlicheVertretung,
  ...beratungshilfeGrundvoraussetzungen,
  ...beratungshilfeRechtsproblem,
  ...beratungshilfeFinanzielleAngaben,
  ...finanzielleAngabenPartnerContext,
  ...beratungshilfePersoenlicheDaten,
  ...abgabeContext,
} as const;
