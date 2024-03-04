import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import {
  adresse,
  persoenlicheDaten,
  namePrivatPerson,
} from "../persoenlicheDaten/context";
import { airportSchema } from "~/services/validation/airport";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import {
  airlineSchema,
  fluggastBereichSchema,
  zustaendigesAmtsgerichtSchema,
} from "../fluggastrechte/context";
import {
  checkedOptional,
  checkedRequired,
} from "~/services/validation/checkedCheckbox";
import { createDateSchema, today, addDays } from "~/services/validation/date";
import { timeSchema } from "~/services/validation/time";
import { integerSchema } from "~/services/validation/integer";

const FileUploadDummySchema = z.string().or(z.object({})).or(z.array(z.any()));

export const fluggastrechtContext = {
  startAirport: airportSchema,
  endAirport: airportSchema,
  fluggesellschaft: airlineSchema,
  bereich: fluggastBereichSchema,
  zwischenstopps: YesNoAnswer,
  buchungsbestaetigung: FileUploadDummySchema,
  schriftverkehr: FileUploadDummySchema,
  singleFlugnummer: inputRequiredSchema,
  singleAbflugDatum: createDateSchema(),
  singleAbflugZeit: timeSchema,
  singleAnkunftDatum: createDateSchema(),
  singleAnkunftZeit: timeSchema,
  zwischenstoppFlugnummer: inputRequiredSchema,
  zwischenstoppAbflugDatum: createDateSchema(),
  zwischenstoppAbflugZeit: timeSchema,
  zwischenstoppAnkunftDatum: createDateSchema(),
  zwischenstoppAnkunftZeit: timeSchema,
  zwischenstoppFlugnummer2: inputRequiredSchema,
  zwischenstoppAbflugDatum2: createDateSchema(),
  zwischenstoppAbflugZeit2: timeSchema,
  zwischenstoppAnkunftDatum2: createDateSchema(),
  zwischenstoppAnkunftZeit2: timeSchema,
  zwischenstoppFlughafen: z.union([airportSchema, z.literal("")]),
  ankunftsDatum: createDateSchema({ latest: () => today() }),
  ankunftsZeit: timeSchema,
  ankunftsFlugnummer: inputRequiredSchema,
  ankunftWithSameFlight: YesNoAnswer,
  anzahl: z.enum(["1", "2", "3"], customRequiredErrorMessage),
  ...persoenlicheDaten,
  ...adresse,
  ...namePrivatPerson,
  volljaehrig: YesNoAnswer,
  gesetzlicheVertretung: YesNoAnswer,
  entfernung: integerSchema,
  teilentschaedigung: YesNoAnswer,
  frist: createDateSchema({
    earliest: () => addDays(today(), -3 * 365),
    latest: () => addDays(today(), -1),
  }),
  nebenforderungen: z.object({
    verzugszinsen: checkedOptional,
    prozesszinsen: checkedOptional,
  }),
  versaeumnisurteil: YesNoAnswer,
  anmerkung: z.string(),
  doMigration: YesNoAnswer,
  aenderungMitteilung: checkedRequired,
  zahlungOptional: checkedOptional,
  zustaendigesAmtsgericht: zustaendigesAmtsgerichtSchema.optional(),
} as const;

const contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof contextObject>;
