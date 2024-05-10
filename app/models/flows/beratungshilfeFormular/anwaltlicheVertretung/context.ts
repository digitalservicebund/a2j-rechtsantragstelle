import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { createDateSchema } from "~/services/validation/date";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { postcodeSchema } from "~/services/validation/postcode";

export const beratungshilfeAnwaltlicheVertretung = {
  anwaltskanzlei: YesNoAnswer,
  beratungStattgefunden: YesNoAnswer,
  beratungStattgefundenDatum: createDateSchema(),
  anwaltName: stringRequiredSchema,
  anwaltStrasseUndHausnummer: stringRequiredSchema,
  anwaltPlz: stringRequiredSchema.pipe(postcodeSchema),
  anwaltOrt: stringRequiredSchema,
};

const contextObject = z.object(beratungshilfeAnwaltlicheVertretung).partial();
export type BeratungshilfeAnwaltlicheVertretung = z.infer<typeof contextObject>;
