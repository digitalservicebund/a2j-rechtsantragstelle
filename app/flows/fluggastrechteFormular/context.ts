import { z } from "zod";
import { zustaendigesAmtsgerichtSchema } from "~/flows/fluggastrechteVorabcheck/context";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { fluggastrechteFlugdaten } from "./flugdaten/context";
import { fluggastrechtForderungDaten } from "./forderung/context";
import { fluggastrechtePersoenlichDaten } from "./persoenlicheDaten/context";
import { fluggastrechtVersandDaten } from "./versand/context";

export const fluggastrechtContext = {
  startAirport: optionalOrSchema(airportSchema),
  endAirport: optionalOrSchema(airportSchema),
  fluggesellschaft: optionalOrSchema(airlineSchema),
  bereich: stringOptionalSchema,
  doMigration: YesNoAnswer,
  zustaendigesAmtsgericht: zustaendigesAmtsgerichtSchema.optional(),
  ...fluggastrechteFlugdaten,
  ...fluggastrechtePersoenlichDaten,
  ...fluggastrechtForderungDaten,
  ...fluggastrechtVersandDaten,
} as const;

const _contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof _contextObject>;
