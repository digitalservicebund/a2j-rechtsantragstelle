import { z } from "zod";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { postcodeSchema } from "~/services/validation/postcode";

const titleSchema = z.enum(["", "dr"]);

export const namePrivatPerson = {
  anrede: stringOptionalSchema,
  title: titleSchema,
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

export const persoenlicheDaten = {
  telefonnummer: z.union([phoneNumberSchema, z.literal("")]),
  bevollmaechtigtePerson: z.enum(
    ["lawyer", "yes", "no"],
    customRequiredErrorMessage,
  ),
};

export const adresseSchema = {
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};
