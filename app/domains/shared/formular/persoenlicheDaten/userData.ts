import { z } from "zod";
import { createDateSchema } from "~/services/validation/date";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const titleSchema = z.enum(["", "dr"], customRequiredErrorMessage);

export const vornameNachnameSchema = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

export const telefonnummer = optionalOrSchema(phoneNumberSchema);

export const namePrivatPerson = {
  title: titleSchema,
  ...vornameNachnameSchema,
};

export const adresseSchema = {
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};

export const geburtsdatum = createDateSchema({
  earliest: () => addYears(today(), -150),
  latest: () => today(),
}).optional();

export const persoenlicheDaten = {
  ...namePrivatPerson,
  ...adresseSchema,
  telefonnummer,
};

export const beruf = stringRequiredSchema;
