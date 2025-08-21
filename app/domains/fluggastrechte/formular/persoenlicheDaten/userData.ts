import { z } from "zod";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { bookingNumberFlightSchema } from "~/services/validation/bookingNumberFlight";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { ibanSchema } from "~/services/validation/iban";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const anredeSchema = z.enum(["herr", "frau", "none"]);

export const vornameNachnameSchema = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

export const namePrivatPerson = {
  title: z.enum(["", "dr"]),
  ...vornameNachnameSchema,
};

export const adresseSchema = {
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};

export const telefonnummer = schemaOrEmptyString(phoneNumberSchema);

export const persoenlicheDaten = {
  ...namePrivatPerson,
  ...adresseSchema,
  telefonnummer,
};

const persoenlicheDatenInputSchema = {
  anrede: anredeSchema,
  ...persoenlicheDaten,
  land: stringRequiredSchema,
  plz: stringRequiredSchema,
};

const paymentDetailsSchema = {
  iban: schemaOrEmptyString(ibanSchema),
  kontoinhaber: stringOptionalSchema,
};

export const fluggastrechtePersoenlicheDatenInputSchema = {
  ...persoenlicheDatenInputSchema,
  isWeiterePersonen: YesNoAnswer,
  ...paymentDetailsSchema,
  weiterePersonen: z.array(
    z
      .object({
        ...persoenlicheDatenInputSchema,
        buchungsnummer: schemaOrEmptyString(bookingNumberFlightSchema),
        datenverarbeitungZustimmung: checkedRequired,
      })
      .partial(),
  ),
  pageData: pageDataSchema,
};

const _partialSchema = z
  .object(fluggastrechtePersoenlicheDatenInputSchema)
  .partial();
export type FluggastrechtePersoenlichDaten = z.infer<typeof _partialSchema>;
