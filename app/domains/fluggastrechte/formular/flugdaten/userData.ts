import { z } from "zod";
import { airportSchema } from "~/services/validation/airport";
import { bookingNumberFlightSchema } from "~/services/validation/bookingNumberFlight";
import { createDateSchema } from "~/services/validation/date";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { timeSchema } from "~/services/validation/time";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const fourYearsAgoSchema = createDateSchema({
  earliest: () => addYears(today(), -4),
  latest: () => today(),
});

export const fluggastrechteFlugdatenInputSchema = {
  direktFlugnummer: stringRequiredSchema,
  buchungsNummer: bookingNumberFlightSchema,
  direktAbflugsDatum: fourYearsAgoSchema,
  direktAbflugsZeit: timeSchema,
  direktAnkunftsDatum: fourYearsAgoSchema,
  direktAnkunftsZeit: timeSchema,
  tatsaechlicherFlug: YesNoAnswer,
  tatsaechlicherAnkunftsDatum: fourYearsAgoSchema,
  tatsaechlicherAnkunftsZeit: timeSchema,
  ersatzverbindungArt: z.enum(["flug", "etwasAnderes", "keineAnkunft"]),
  fluggesellschaftStrasseHausnummer: stringRequiredSchema,
  fluggesellschaftPostleitzahl: stringRequiredSchema,
  fluggesellschaftOrt: stringRequiredSchema,
  fluggesellschaftLand: stringRequiredSchema,
  zwischenstoppAnzahl: z.enum(["no", "oneStop", "twoStop", "threeStop"]),
  verspaeteterFlug: z.enum([
    "startAirportFirstZwischenstopp",
    "firstZwischenstoppEndAirport",
    "firstAirportSecondZwischenstopp",
    "secondZwischenstoppEndAirport",
    "secondAirportThirdZwischenstopp",
    "thirdZwischenstoppEndAirport",
  ]),
  anschlussFlugVerpasst: YesNoAnswer,
  ersterZwischenstopp: airportSchema.optional(),
  zweiterZwischenstopp: airportSchema.optional(),
  dritterZwischenstopp: airportSchema.optional(),
  bereich: stringOptionalSchema,
  ersatzflug: stringOptionalSchema,
  andereErsatzverbindungBeschreibung: stringOptionalSchema,
  andereErsatzverbindungAnkunftsDatum: fourYearsAgoSchema,
  andereErsatzverbindungAnkunftsZeit: timeSchema,
  ersatzFlugnummer: stringRequiredSchema,
  ersatzFlugAnkunftsDatum: fourYearsAgoSchema,
  ersatzFlugAnkunftsZeit: timeSchema,
  zusaetzlicheAngaben: stringOptionalSchema,
  annullierungErsatzverbindungFlugnummer:
    schemaOrEmptyString(stringOptionalSchema),
  annullierungErsatzverbindungAbflugsDatum:
    schemaOrEmptyString(fourYearsAgoSchema),
  annullierungErsatzverbindungAbflugsZeit: schemaOrEmptyString(timeSchema),
  annullierungErsatzverbindungAnkunftsDatum:
    schemaOrEmptyString(fourYearsAgoSchema),
  annullierungErsatzverbindungAnkunftsZeit: schemaOrEmptyString(timeSchema),
};

const _partialObject = z.object(fluggastrechteFlugdatenInputSchema).partial();
export type FluggastrechteFlugdatenUserData = z.infer<typeof _partialObject>;
