import { z } from "zod";
import { createDateSchema } from "~/services/validation/date";
import { flightNumberSchema } from "~/services/validation/flightNumber";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { timeSchema } from "~/services/validation/time";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

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
};

const _contextObject = z.object(fluggastrechteFlugDaten).partial();
export type FluggastrechteFlugDatenContext = z.infer<typeof _contextObject>;
