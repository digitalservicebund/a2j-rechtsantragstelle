import { z } from "zod";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

const titleSchema = z.enum(["", "dr"], customRequiredErrorMessage);

export const namePrivatPerson = {
  anrede: stringOptionalSchema,
  title: titleSchema,
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

export const adresseSchema = {
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};

export const persoenlicheDaten = {
  ...namePrivatPerson,
  ...adresseSchema,
  telefonnummer: optionalOrSchema(phoneNumberSchema),
};
