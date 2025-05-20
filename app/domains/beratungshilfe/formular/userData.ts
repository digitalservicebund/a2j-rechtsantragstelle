import { beratungshilfePersoenlicheDatenInputSchema } from "~/domains/beratungshilfe/formular/persoenlicheDaten/userData";
import { abgabeInputSchema } from "~/domains/shared/formular/abgabe/userData";
import { dokumenteInputSchema } from "./abgabe/dokumente/userData";
import { beratungshilfeAnwaltlicheVertretungInputSchema } from "./anwaltlicheVertretung/userData";
import { beratungshilfeFinanzielleAngabenInputSchema } from "./finanzielleAngaben/userData";
import { beratungshilfeGrundvoraussetzungenInputSchema} from "./grundvoraussetzung/userData";
import { beratungshilfeRechtsproblemInputSchema } from "./rechtsproblem/userData";

export const beratungshilfeFormularUserData = {
  ...beratungshilfeAnwaltlicheVertretungInputSchema,
  ...beratungshilfeGrundvoraussetzungenInputSchema,
  ...beratungshilfeRechtsproblemInputSchema,
  ...beratungshilfeFinanzielleAngabenInputSchema,
  ...beratungshilfePersoenlicheDatenInputSchema,
  ...dokumenteInputSchema,
  ...abgabeInputSchema,
} as const;
