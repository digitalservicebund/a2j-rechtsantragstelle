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

const persoenlicheDatenInputSchema = {
  anrede: anredeSchema,
  title: z.enum(["", "dr"]),
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
  telefonnummer: schemaOrEmptyString(phoneNumberSchema),
  land: stringRequiredSchema,
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
