import { z } from "zod";
import {
  fluggastBereichSchema,
  zustaendigesAmtsgerichtSchema,
} from "~/flows/fluggastrechteVorabcheck/context";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { createDateSchema } from "~/services/validation/date";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { timeSchema } from "~/services/validation/time";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";
import { fluggastrechtForderungDaten } from "./forderung/context";
import { fluggastrechtePersoenlichDaten } from "./persoenlicheDaten/context";
import { fluggastrechtVersandDaten } from "./versand/context";

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
  volljaehrig: YesNoAnswer,
  gesetzlicheVertretung: YesNoAnswer,
  doMigration: YesNoAnswer,
  zahlungOptional: checkedOptional,
  zustaendigesAmtsgericht: zustaendigesAmtsgerichtSchema.optional(),
  ...fluggastrechtePersoenlichDaten,
  ...fluggastrechtForderungDaten,
  ...fluggastrechtVersandDaten,
} as const;

const _contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof _contextObject>;
