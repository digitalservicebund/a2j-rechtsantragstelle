import { z } from "zod";
import {
  fluggastBereichSchema,
  zustaendigesAmtsgerichtSchema,
} from "~/flows/fluggastrechteVorabcheck/context";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import {
  checkedOptional,
  checkedRequired,
} from "~/services/validation/checkedCheckbox";
import { createDateSchema } from "~/services/validation/date";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { timeSchema } from "~/services/validation/time";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { addDays, addYears, today } from "~/util/date";
import {
  adresse,
  persoenlicheDaten,
  namePrivatPerson,
} from "../persoenlicheDaten/context";

export const fluggastrechtContext = {
  startAirport: airportSchema,
  endAirport: airportSchema,
  fluggesellschaft: airlineSchema,
  bereich: fluggastBereichSchema,
  zwischenstopps: YesNoAnswer,
  singleFlugnummer: stringRequiredSchema,
  singleAbflugDatum: createDateSchema(),
  singleAbflugZeit: timeSchema,
  singleAnkunftDatum: createDateSchema(),
  singleAnkunftZeit: timeSchema,
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
  anzahl: z.enum(["1", "2", "3"], customRequiredErrorMessage),
  ...persoenlicheDaten,
  ...adresse,
  ...namePrivatPerson,
  volljaehrig: YesNoAnswer,
  gesetzlicheVertretung: YesNoAnswer,
  teilentschaedigung: YesNoAnswer,
  frist: createDateSchema({
    earliest: () => addYears(today(), -3),
    latest: () => addDays(today(), -1),
  }),
  nebenforderungen: z.object({
    verzugszinsen: checkedOptional,
    prozesszinsen: checkedOptional,
  }),
  versaeumnisurteil: YesNoAnswer,
  anmerkung: stringOptionalSchema,
  doMigration: YesNoAnswer,
  aenderungMitteilung: checkedRequired,
  zahlungOptional: checkedOptional,
  zustaendigesAmtsgericht: zustaendigesAmtsgerichtSchema.optional(),
} as const;

const _contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof _contextObject>;
