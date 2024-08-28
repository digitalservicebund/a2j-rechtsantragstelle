import { z } from "zod";
import { fluggastBereichSchema } from "~/flows/fluggastrechteVorabcheck/context";
import { airportSchema } from "~/services/validation/airport";
import { createDateSchema } from "~/services/validation/date";
import { flightNumberSchema } from "~/services/validation/flightNumber";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
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
  zwischenstopps: YesNoAnswer,
  direktFlugnummer: flightNumberSchema,
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
    ["no", "oneStop", "twoStop", "threeStop", "fourStop", "fiveStop"],
    customRequiredErrorMessage,
  ),
  ersterZwischenstopp: airportSchema,
  zweiterZwischenstopp: airportSchema,
  dritterZwischenstopp: airportSchema,
  vierterZwischenstopp: airportSchema,
  fuenfterZwischenstopp: airportSchema,
  bereich: fluggastBereichSchema,
  andereErsatzverbindungBeschreibung: stringRequiredSchema,
  andereErsatzverbindungStartDatum: fourYearsAgoSchema,
  andereErsatzverbindungStartZeit: timeSchema,
  andereErsatzverbindungAnkunftsDatum: fourYearsAgoSchema,
  andereErsatzverbindungAnkunftsZeit: timeSchema,
  ersatzFlugnummer: flightNumberSchema,
  ersatzFlugAnkunftsDatum: fourYearsAgoSchema,
  ersatzFlugAnkunftsZeit: timeSchema,
  zusaetzlicheAngaben: stringOptionalSchema,
};

const _contextObject = z.object(fluggastrechteFlugdaten).partial();
export type FluggastrechteFlugdatenContext = z.infer<typeof _contextObject>;
