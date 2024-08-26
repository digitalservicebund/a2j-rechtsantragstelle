import { z } from "zod";
import { zustaendigesAmtsgerichtSchema } from "~/flows/fluggastrechteVorabcheck/context";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { fluggastrechteFlugdaten } from "./flugdaten/context";
import { fluggastrechtForderungDaten } from "./forderung/context";
import { fluggastrechtePersoenlichDaten } from "./persoenlicheDaten/context";
import { fluggastrechtVersandDaten } from "./versand/context";

export const fluggastrechtContext = {
  startAirport: airportSchema,
  endAirport: airportSchema,
  fluggesellschaft: airlineSchema,
  doMigration: YesNoAnswer,
  zustaendigesAmtsgericht: zustaendigesAmtsgerichtSchema.optional(),
  ...fluggastrechteFlugdaten,
  ...fluggastrechtePersoenlichDaten,
  ...fluggastrechtForderungDaten,
  ...fluggastrechtVersandDaten,
} as const;

const _contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof _contextObject>;
