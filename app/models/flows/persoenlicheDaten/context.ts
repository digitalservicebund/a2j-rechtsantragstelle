import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";

const titleSchema = z.enum(["", "dr"]);

export const adresse = {
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};

export const namePrivatPerson = {
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
