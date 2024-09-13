import { z } from "zod";
import { createDateSchema } from "~/services/validation/date";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

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
  geburtsdatum: createDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => today(),
  }),
  ...adresseSchema,
  telefonnummer: optionalOrSchema(phoneNumberSchema),
};

const _contextObject = z.object(persoenlicheDaten).partial();
export type PersoenlicheDaten = z.infer<typeof _contextObject>;
