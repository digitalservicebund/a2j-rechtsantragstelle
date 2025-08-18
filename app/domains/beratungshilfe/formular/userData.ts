import { z } from "zod";
import { type BeratungshilfePersoenlicheDatenUserData } from "~/domains/beratungshilfe/formular/persoenlicheDaten/userData";
import { abgabeInputSchema } from "~/domains/shared/formular/abgabe/userData";
import { weitereAngabenSchema } from "~/domains/shared/formular/weitereAngaben/userData";
import { dokumenteInputSchema } from "./abgabe/dokumente/userData";
import { type BeratungshilfeAnwaltlicheVertretungUserData } from "./anwaltlicheVertretung/userData";
import { beratungshilfeFinanzielleAngabenInputSchema } from "./finanzielleAngaben/userData";
import { type BeratungshilfeGrundvoraussetzungenUserData } from "./grundvoraussetzung/userData";
import { type BeratungshilfeRechtsproblemUserData } from "./rechtsproblem/userData";

export const beratungshilfeFormularUserData = {
  ...beratungshilfeFinanzielleAngabenInputSchema,
  ...dokumenteInputSchema,
  ...weitereAngabenSchema,
  ...abgabeInputSchema,
} as const;

const _partialSchema = z.object(beratungshilfeFormularUserData).partial();
export type BeratungshilfeFormularUserData = z.infer<typeof _partialSchema> &
  BeratungshilfeGrundvoraussetzungenUserData &
  BeratungshilfeRechtsproblemUserData &
  BeratungshilfeAnwaltlicheVertretungUserData &
  BeratungshilfePersoenlicheDatenUserData;
