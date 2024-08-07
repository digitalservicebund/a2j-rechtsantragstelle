import { z } from "zod";
import { airportSchema } from "~/services/validation/airport";
import { createDateSchema } from "~/services/validation/date";
import { flightNumberSchema } from "~/services/validation/flightNumber";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { timeSchema } from "~/services/validation/time";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";

export const fluggastrechteFlugDaten = {
  zwischenstopps: YesNoAnswer,
  direktFlugnummer: flightNumberSchema,
  direktAbflugsDatum: createDateSchema(),
  direktAbflugsZeit: timeSchema,
  direktAnkunftsDatum: createDateSchema(),
  direktAnkunftsZeit: timeSchema,
  tatsaechlicherFlug: YesNoAnswer,
  tatsaechlicherAnkunftsDatum: createDateSchema(),
  tatsaechlicherAnkunftsZeit: timeSchema,
  ersatzverbindungArt: z.enum(
    ["flug", "etwasAnderes", "keineAnkunft"],
    customRequiredErrorMessage,
  ),
  andereErsatzverbindungBeschreibung: stringRequiredSchema,
  andereErsatzverbindungStartDatum: createDateSchema(),
  andereErsatzverbindungStartZeit: timeSchema,
  andereErsatzverbindungAnkunftsDatum: createDateSchema(),
  andereErsatzverbindungAnkunftsZeit: timeSchema,
  ersatzFlugnummer: flightNumberSchema,
  ersatzFlugAnkunftsDatum: createDateSchema(),
  ersatzFlugAnkunftsZeit: timeSchema,
  zwischenstoppFlugnummer: stringRequiredSchema,
  zwischenstoppAbflugDatum: createDateSchema(),
  zwischenstoppAbflugZeit: timeSchema,
  zwischenstoppAnkunftDatum: createDateSchema(),
  zwischenstoppAnkunftZeit: timeSchema,
  zwischenstoppFlugnummer2: stringRequiredSchema,
  zwischenstoppAbflugDatum2: createDateSchema(),
  zwischenstoppAbflugZeit2: timeSchema,
  zwischenstoppAnkunftDatum2: createDateSchema(),
  zwischenstoppAnkunftZeit2: timeSchema,
  zwischenstoppFlughafen: z.union([airportSchema, z.literal("")]),
  ankunftsDatum: createDateSchema({ latest: () => today() }),
  ankunftsZeit: timeSchema,
  ankunftsFlugnummer: stringRequiredSchema,
  ankunftWithSameFlight: YesNoAnswer,
};

const _contextObject = z.object(fluggastrechteFlugDaten).partial();
export type FluggastrechteFlugDatenContext = z.infer<typeof _contextObject>;
