import { z } from "zod";
import { beratungshilfePersoenlicheDatenInputSchema } from "~/domains/beratungshilfe/formular/persoenlicheDaten/userData";
import { abgabeInputSchema } from "~/domains/shared/formular/abgabe/userData";
import { weitereAngabenSchema } from "~/domains/shared/formular/weitereAngaben/userData";
import { dokumenteInputSchema } from "./abgabe/dokumente/userData";
import { beratungshilfeAnwaltlicheVertretungInputSchema } from "./anwaltlicheVertretung/userData";
import { beratungshilfeFinanzielleAngabenInputSchema } from "./finanzielleAngaben/userData";
import { beratungshilfeGrundvoraussetzungenInputSchema } from "./grundvoraussetzung/userData";
import { beratungshilfeRechtsproblemInputSchema } from "./rechtsproblem/userData";

export const beratungshilfeFormularUserData = {
  ...beratungshilfeAnwaltlicheVertretungInputSchema,
  ...beratungshilfeGrundvoraussetzungenInputSchema,
  ...beratungshilfeRechtsproblemInputSchema,
  ...beratungshilfeFinanzielleAngabenInputSchema,
  ...beratungshilfePersoenlicheDatenInputSchema,
  ...dokumenteInputSchema,
  ...weitereAngabenSchema,
  ...abgabeInputSchema,
} as const;

const _partialSchema = z.object(beratungshilfeFormularUserData).partial();
export type BeratungshilfeFormularUserData = z.infer<typeof _partialSchema>;
