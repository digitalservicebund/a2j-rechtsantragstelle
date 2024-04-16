import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { createDateSchema } from "~/services/validation/date";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import { postcodeSchema } from "~/services/validation/postcode";

export const beratungshilfeAnwaltlicheVertretung = {
  anwaltskanzlei: YesNoAnswer,
  beratungStattgefunden: YesNoAnswer,
  beratungStattgefundenDatum: createDateSchema(),
  anwaltName: inputRequiredSchema,
  anwaltStrasseUndHausnummer: inputRequiredSchema,
  anwaltPlz: inputRequiredSchema.pipe(postcodeSchema),
  anwaltOrt: inputRequiredSchema,
};

const contextObject = z.object(beratungshilfeAnwaltlicheVertretung).partial();
export type BeratungshilfeAnwaltlicheVertretung = z.infer<typeof contextObject>;
