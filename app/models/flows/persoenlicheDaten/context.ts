import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";

const titleSchema = z.enum(["", "dr"]);

export const adresse = {
  strasseHausnummer: inputRequiredSchema,
  plz: inputRequiredSchema.pipe(postcodeSchema),
  ort: inputRequiredSchema,
};

export const namePrivatPerson = {
  title: titleSchema,
  vorname: inputRequiredSchema,
  nachname: inputRequiredSchema,
};

export const persoenlicheDaten = {
  telefonnummer: inputRequiredSchema.pipe(phoneNumberSchema),
  bevollmaechtigtePerson: z.enum(
    ["lawyer", "yes", "no"],
    customRequiredErrorMessage,
  ),
};
