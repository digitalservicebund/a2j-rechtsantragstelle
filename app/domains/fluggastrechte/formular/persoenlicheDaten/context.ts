import { z } from "zod";
import { persoenlicheDaten } from "~/domains/shared/formular/persoenlicheDaten/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { bookingNumberFlightSchema } from "~/services/validation/bookingNumberFlight";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { ibanSchema } from "~/services/validation/iban";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const anredeSchema = z.enum(["herr", "frau", "none"]);

const persoenlicheDatenSchema = {
  anrede: anredeSchema,
  ...persoenlicheDaten,
  land: stringRequiredSchema,
  plz: stringRequiredSchema,
};

const paymentDetailsSchema = {
  iban: optionalOrSchema(ibanSchema),
  kontoinhaber: stringOptionalSchema,
};

export const fluggastrechtePersoenlichDaten = {
  ...persoenlicheDatenSchema,
  isWeiterePersonen: YesNoAnswer,
  ...paymentDetailsSchema,
  weiterePersonen: z.array(
    z
      .object({
        ...persoenlicheDatenSchema,
        buchungsnummer: optionalOrSchema(bookingNumberFlightSchema),
        datenverarbeitungZustimmung: checkedRequired,
      })
      .partial(),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z.object(fluggastrechtePersoenlichDaten).partial();
export type FluggastrechtePersoenlichDaten = z.infer<typeof _contextObject>;
