import { z } from "zod";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

const titleSchema = z.enum([" ", "dr"]);
const anredeSchema = z.enum(["mr", "mrs", "not-defined"]);

export const adresse = {
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};

export const namePrivatPerson = {
  anrede: anredeSchema,
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
