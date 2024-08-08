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
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { addDays, addYears, today } from "~/util/date";
import { fluggastrechteFlugdaten } from "./flugdaten/context";
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
  ...fluggastrechteFlugdaten,
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
