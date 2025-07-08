import { z } from "zod";
import { createDateSchema } from "~/services/validation/date";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const titleSchema = z.enum(["", "dr"], customRequiredErrorMessage);

export const vornameNachnameSchema = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

export const telefonnummer = schemaOrEmptyString(phoneNumberSchema);

export const namePrivatPerson = {
  title: titleSchema,
  ...vornameNachnameSchema,
};

export const streetHouseNumberSchema = {
  street: stringRequiredSchema,
  houseNumber: stringRequiredSchema,
};

export const adresseSchema = {
  ...streetHouseNumberSchema,
  strasseHausnummer: stringRequiredSchema, // TODO: remove me
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

const _partialSchema = z.object(persoenlicheDaten).partial();
export type PersoenlicheDatenUserData = z.infer<typeof _partialSchema>;

export const beruf = stringRequiredSchema;
