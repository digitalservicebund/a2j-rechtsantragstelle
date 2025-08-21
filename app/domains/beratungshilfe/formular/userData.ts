import { z } from "zod";
import { beratungshilfePersoenlicheDatenInputSchema } from "~/domains/beratungshilfe/formular/persoenlicheDaten/userData";
import { type BeratungshilfeAbgabeUserData } from "./abgabe/userData";
import { type BeratungshilfeAnwaltlicheVertretungUserData } from "./anwaltlicheVertretung/userData";
import { beratungshilfeFinanzielleAngabenInputSchema } from "./finanzielleAngaben/userData";
import { type BeratungshilfeGrundvoraussetzungenUserData } from "./grundvoraussetzung/userData";
import { type BeratungshilfeRechtsproblemUserData } from "./rechtsproblem/userData";
import { type BeratungshilfeWeitereAngabenUserData } from "./weitereAngaben/userData";

export const beratungshilfeFormularUserData = {
  ...beratungshilfeFinanzielleAngabenInputSchema,
  ...beratungshilfePersoenlicheDatenInputSchema,
} as const;

const _partialSchema = z.object(beratungshilfeFormularUserData).partial();
export type BeratungshilfeFormularUserData = z.infer<typeof _partialSchema> &
  BeratungshilfeGrundvoraussetzungenUserData &
  BeratungshilfeRechtsproblemUserData &
  BeratungshilfeAnwaltlicheVertretungUserData &
  BeratungshilfeWeitereAngabenUserData &  
  BeratungshilfeAbgabeUserData;