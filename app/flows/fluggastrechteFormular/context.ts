import { z } from "zod";
import { zustaendigesAmtsgerichtSchema } from "~/flows/fluggastrechteVorabcheck/context";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { fluggastrechteFlugdaten } from "./flugdaten/context";
import { fluggastrechtGrundvoraussetzungenDaten } from "./grundvoraussetzungen/context";
import { fluggastrechtePersoenlichDaten } from "./persoenlicheDaten/context";
import { fluggastrechtStreitKostenDaten } from "./streitwertKosten/context";

export const fluggastrechtContext = {
  startAirport: optionalOrSchema(airportSchema),
  endAirport: optionalOrSchema(airportSchema),
  fluggesellschaft: optionalOrSchema(airlineSchema),
  zustaendigesAmtsgericht: zustaendigesAmtsgerichtSchema.optional(),
  ...fluggastrechteFlugdaten,
  ...fluggastrechtePersoenlichDaten,
  ...fluggastrechtStreitKostenDaten,
  ...fluggastrechtGrundvoraussetzungenDaten,
  ankuendigung: stringOptionalSchema,
  ersatzflug: stringOptionalSchema,
  ersatzflugStartenEinStunde: stringOptionalSchema,
  ersatzflugLandenZweiStuden: stringOptionalSchema,
  ersatzflugStartenZweiStunden: stringOptionalSchema,
  ersatzflugLandenVierStunden: stringOptionalSchema,
} as const;

const _contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof _contextObject>;
