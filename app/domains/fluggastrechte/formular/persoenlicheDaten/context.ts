import { z } from "zod";
import { persoenlicheDaten } from "~/domains/shared/formular/persoenlicheDaten/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { bookingNumberFlightSchema } from "~/services/validation/bookingNumberFlight";
import { ibanSchema } from "~/services/validation/iban";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const paymentDetailsSchema = {
  iban: optionalOrSchema(ibanSchema),
  kontoinhaber: stringOptionalSchema,
};

export const fluggastrechtePersoenlichDaten = {
  ...persoenlicheDaten,
  isWeiterePersonen: YesNoAnswer,
  hasZeugen: YesNoAnswer,
  ...paymentDetailsSchema,
  weiterePersonen: z.array(
    z
      .object({
        ...persoenlicheDaten,
        buchungsnummer: optionalOrSchema(bookingNumberFlightSchema),
      })
      .partial(),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z.object(fluggastrechtePersoenlichDaten).partial();
export type FluggastrechtePersoenlichDaten = z.infer<typeof _contextObject>;
