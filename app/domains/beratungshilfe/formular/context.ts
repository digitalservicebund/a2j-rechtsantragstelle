import { dokumenteContext } from "~/domains/beratungshilfe/formular/abgabe/dokumente/context";
import { beratungshilfePersoenlicheDaten } from "~/domains/beratungshilfe/formular/persoenlicheDaten/context";
import { beratungshilfeAnwaltlicheVertretung } from "./anwaltlicheVertretung/userData";
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
  ...dokumenteContext,
  ...abgabeContext,
} as const;
