import { z } from "zod";
import { airportSchema } from "~/services/validation/airport";
import { bookingNumberFlightSchema } from "~/services/validation/bookingNumberFlight";
import { createDateSchema } from "~/services/validation/date";
import { flightNumberSchema } from "~/services/validation/flightNumber";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { timeSchema } from "~/services/validation/time";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const fourYearsAgoSchema = createDateSchema({
  earliest: () => addYears(today(), -4),
  latest: () => today(),
});

export const fluggastrechteFlugdaten = {
  direktFlugnummer: flightNumberSchema,
  buchungsNummer: bookingNumberFlightSchema,
  direktAbflugsDatum: fourYearsAgoSchema,
  direktAbflugsZeit: timeSchema,
  direktAnkunftsDatum: fourYearsAgoSchema,
  direktAnkunftsZeit: timeSchema,
  tatsaechlicherFlug: YesNoAnswer,
  tatsaechlicherAnkunftsDatum: fourYearsAgoSchema,
  tatsaechlicherAnkunftsZeit: timeSchema,
  ersatzverbindungArt: z.enum(
    ["flug", "etwasAnderes", "keineAnkunft"],
    customRequiredErrorMessage,
  ),
  zwischenstoppAnzahl: z.enum(
    ["no", "oneStop", "twoStop", "threeStop"],
    customRequiredErrorMessage,
  ),
  verspaeteterFlug: z.enum(
    [
      "startAirportFirstZwischenstopp",
      "firstZwischenstoppEndAirport",
      "firstAirportSecondZwischenstopp",
      "secondZwischenstoppEndAirport",
      "secondAirportThirdZwischenstopp",
      "thirdZwischenstoppEndAirport",
    ],
    customRequiredErrorMessage,
  ),
  anschlussFlugVerpasst: YesNoAnswer,
  ersterZwischenstopp: airportSchema,
  zweiterZwischenstopp: airportSchema,
  dritterZwischenstopp: airportSchema,
  bereich: stringOptionalSchema,
  andereErsatzverbindungBeschreibung: stringOptionalSchema,
  andereErsatzverbindungAnkunftsDatum: fourYearsAgoSchema,
  andereErsatzverbindungAnkunftsZeit: timeSchema,
  ersatzFlugnummer: flightNumberSchema,
  ersatzFlugAnkunftsDatum: fourYearsAgoSchema,
  ersatzFlugAnkunftsZeit: timeSchema,
  zusaetzlicheAngaben: stringOptionalSchema,
};

const _contextObject = z.object(fluggastrechteFlugdaten).partial();
export type FluggastrechteFlugdatenContext = z.infer<typeof _contextObject>;
