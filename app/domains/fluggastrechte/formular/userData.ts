import { z } from "zod";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { fluggastrechteFlugdatenInputSchema } from "./flugdaten/userData";
import { fluggastrechteGrundvoraussetzungen } from "./grundvoraussetzungen/context";
import { fluggastrechtePersoenlicheDatenInputSchema } from "./persoenlicheDaten/context";
import { fluggastrechteProzessfuehrungDaten } from "./prozessfuehrung/context";
import { fluggastrechteStreitKostenDaten } from "./streitwertKosten/context";

export const fluggastrechteInputSchema = {
  startAirport: optionalOrSchema(airportSchema),
  endAirport: optionalOrSchema(airportSchema),
  fluggesellschaft: optionalOrSchema(airlineSchema),
  ...fluggastrechteFlugdatenInputSchema,
  ...fluggastrechtePersoenlicheDatenInputSchema,
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

const _contextObject = z.object(fluggastrechteInputSchema).partial();
export type FluggastrechteUserData = z.infer<typeof _contextObject>;
