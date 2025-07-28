import { z } from "zod";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { fluggastrechteFlugdatenInputSchema } from "./flugdaten/userData";
import { fluggastrechteGrundvoraussetzungenInputSchema } from "./grundvoraussetzungen/userData";
import { fluggastrechtePersoenlicheDatenInputSchema } from "./persoenlicheDaten/userData";
import { fluggastrechteProzessfuehrungInputSchema } from "./prozessfuehrung/userData";
import { fluggastrechteStreitKostenInputSchema } from "./streitwertKosten/userData";

export const fluggastrechteInputSchema = {
  startAirport: schemaOrEmptyString(airportSchema),
  endAirport: schemaOrEmptyString(airportSchema),
  fluggesellschaft: schemaOrEmptyString(airlineSchema),
  ...fluggastrechteFlugdatenInputSchema,
  ...fluggastrechtePersoenlicheDatenInputSchema,
  ...fluggastrechteStreitKostenInputSchema,
  ...fluggastrechteProzessfuehrungInputSchema,
  ...fluggastrechteGrundvoraussetzungenInputSchema,
  ankuendigung: schemaOrEmptyString(
    z.enum(["no", "until6Days", "between7And13Days", "moreThan13Days"]),
  ),
  ersatzflugStartenEinStunde: stringOptionalSchema,
  ersatzflugLandenZweiStunden: stringOptionalSchema,
  ersatzflugStartenZweiStunden: stringOptionalSchema,
  ersatzflugLandenVierStunden: stringOptionalSchema,
  entschaedigung: stringOptionalSchema,
} as const;

const _contextObject = z.object(fluggastrechteInputSchema).partial();
export type FluggastrechteUserData = z.infer<typeof _contextObject>;
