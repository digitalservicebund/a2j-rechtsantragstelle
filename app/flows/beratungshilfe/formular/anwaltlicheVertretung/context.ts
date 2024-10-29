import { z } from "zod";
import { createDateSchema } from "~/services/validation/date";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const beratungshilfeAnwaltlicheVertretung = {
  anwaltskanzlei: YesNoAnswer,
  beratungStattgefunden: YesNoAnswer,
  beratungStattgefundenDatum: createDateSchema(),
  anwaltName: stringRequiredSchema,
  anwaltStrasseUndHausnummer: stringRequiredSchema,
  anwaltPlz: stringRequiredSchema.pipe(postcodeSchema),
  anwaltOrt: stringRequiredSchema,
};

const _contextObject = z.object(beratungshilfeAnwaltlicheVertretung).partial();
export type BeratungshilfeAnwaltlicheVertretung = z.infer<
  typeof _contextObject
>;
