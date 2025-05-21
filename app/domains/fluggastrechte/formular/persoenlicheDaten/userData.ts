import { z } from "zod";
import { persoenlicheDaten } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { bookingNumberFlightSchema } from "~/services/validation/bookingNumberFlight";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { ibanSchema } from "~/services/validation/iban";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const anredeSchema = z.enum(["herr", "frau", "none"]);

const persoenlicheDatenInputSchema = {
  anrede: anredeSchema,
  ...persoenlicheDaten,
  land: stringRequiredSchema,
  plz: stringRequiredSchema,
};

const paymentDetailsSchema = {
  iban: optionalOrSchema(ibanSchema),
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
        buchungsnummer: optionalOrSchema(bookingNumberFlightSchema),
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
