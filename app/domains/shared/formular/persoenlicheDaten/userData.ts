import { z } from "zod";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const adresseSchema = {
  /**
   * Pre- Auto-Complete implementation for street, keeping for compatibility with FGR
   */
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};

export const persoenlicheDaten = {
  title: z.enum(["", "dr"]),
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  ...adresseSchema,
  telefonnummer: schemaOrEmptyString(phoneNumberSchema),
};
