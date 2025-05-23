import { z } from "zod";
import { createDateSchema } from "~/services/validation/date";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const beratungshilfeAnwaltlicheVertretungInputSchema = {
  anwaltskanzlei: YesNoAnswer,
  beratungStattgefunden: YesNoAnswer,
  beratungStattgefundenDatum: createDateSchema(),
  anwaltName: stringRequiredSchema,
  anwaltStrasseUndHausnummer: stringRequiredSchema,
  anwaltPlz: stringRequiredSchema.pipe(postcodeSchema),
  anwaltOrt: stringRequiredSchema,
};

const _partialSchema = z
  .object(beratungshilfeAnwaltlicheVertretungInputSchema)
  .partial();
export type BeratungshilfeAnwaltlicheVertretungUserData = z.infer<
  typeof _partialSchema
>;
