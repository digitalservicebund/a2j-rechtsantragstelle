import { z } from "zod";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { fluggastrechteFlugdaten } from "./flugdaten/context";
import { fluggastrechteGrundvoraussetzungen } from "./grundvoraussetzungen/context";
import { fluggastrechtePersoenlichDaten } from "./persoenlicheDaten/context";
import { fluggastrechteProzessfuehrungDaten } from "./prozessfuehrung/context";
import { fluggastrechteStreitKostenDaten } from "./streitwertKosten/context";

export const fluggastrechtContext = {
  startAirport: optionalOrSchema(airportSchema),
  endAirport: optionalOrSchema(airportSchema),
  fluggesellschaft: optionalOrSchema(airlineSchema),
  ...fluggastrechteFlugdaten,
  ...fluggastrechtePersoenlichDaten,
  ...fluggastrechteStreitKostenDaten,
  ...fluggastrechteProzessfuehrungDaten,
  ...fluggastrechteGrundvoraussetzungen,
  ankuendigung: stringOptionalSchema,
  ersatzflugStartenEinStunde: stringOptionalSchema,
  ersatzflugLandenZweiStunden: stringOptionalSchema,
  ersatzflugStartenZweiStunden: stringOptionalSchema,
  ersatzflugLandenVierStunden: stringOptionalSchema,
  entschaedigung: stringOptionalSchema,
} as const;

const _contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof _contextObject>;
