import { dokumenteContext } from "~/domains/beratungshilfe/formular/abgabe/dokumente/context";
import { beratungshilfePersoenlicheDaten } from "~/domains/beratungshilfe/formular/persoenlicheDaten/context";
import { weitereAngabenContext } from "~/domains/shared/formular/weitereAngaben/context";
import { beratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/context";
import { beratungshilfeFinanzielleAngaben } from "./finanzielleAngaben/context";
import { beratungshilfeGrundvoraussetzungen } from "./grundvoraussetzung/context";
import { beratungshilfeRechtsproblem } from "./rechtsproblem/context";
import { abgabeContext } from "../../shared/formular/abgabe/context";

export const beratungshilfeFormularContext = {
  ...beratungshilfeAnwaltlicheVertretung,
  ...beratungshilfeGrundvoraussetzungen,
  ...beratungshilfeRechtsproblem,
  ...beratungshilfeFinanzielleAngaben,
  ...beratungshilfePersoenlicheDaten,
  ...weitereAngabenContext,
  ...dokumenteContext,
  ...abgabeContext,
} as const;
