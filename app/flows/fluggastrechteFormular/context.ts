import { z } from "zod";
import {
  fluggastBereichSchema,
  zustaendigesAmtsgerichtSchema,
} from "~/flows/fluggastrechteVorabcheck/context";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { fluggastrechteFlugdaten } from "./flugdaten/context";
import { fluggastrechtForderungDaten } from "./forderung/context";
import { fluggastrechtePersoenlichDaten } from "./persoenlicheDaten/context";
import { fluggastrechtVersandDaten } from "./versand/context";

export const fluggastrechtContext = {
  startAirport: airportSchema,
  endAirport: airportSchema,
  fluggesellschaft: airlineSchema,
  bereich: fluggastBereichSchema,
  ...fluggastrechteFlugdaten,
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
