import { z } from "zod";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const prozesskostenhilfeGesetzlicheVertretungContext = {
  hasGesetzlicheVertretung: YesNoAnswer,
  gesetzlicheVertretungDaten: z.object({
    vorname: stringRequiredSchema,
    nachname: stringRequiredSchema,
    strasseHausnummer: stringRequiredSchema,
    plz: stringRequiredSchema.pipe(postcodeSchema),
    ort: stringRequiredSchema,
    telefonnummer: stringOptionalSchema,
  }),
};

const _contextObject = z
  .object(prozesskostenhilfeGesetzlicheVertretungContext)
  .partial();
export type ProzesskostenhilfeGesetzlicheVertretung = z.infer<
  typeof _contextObject
>;
