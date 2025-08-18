import omit from "lodash/omit";
import { z } from "zod";
import { createDateSchema } from "~/services/validation/date";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { addYears, today } from "~/util/date";

export const vornameNachnameSchema = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

export const telefonnummer = schemaOrEmptyString(phoneNumberSchema);
export const beruf = stringRequiredSchema;
export const streetHouseNumberSchema = {
  street: stringRequiredSchema,
  houseNumber: germanHouseNumberSchema,
};
export const adresseSchema = {
  ...streetHouseNumberSchema,

  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};

export const geburtsdatum = createDateSchema({
  earliest: () => addYears(today(), -150),
  latest: () => today(),
}).optional();
export const prozesskostenhilfePersoenlicheDatenInputSchema = {
  ...vornameNachnameSchema,
  ...omit(adresseSchema, "strasseHausnummer"),
  geburtsdatum,
  telefonnummer,
  beruf,
};

const _partialSchema = z
  .object(prozesskostenhilfePersoenlicheDatenInputSchema)
  .partial();
export type ProzesskostenhilfePersoenlicheDatenUserData = z.infer<
  typeof _partialSchema
>;
