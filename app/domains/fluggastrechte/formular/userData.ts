import { z } from "zod";
import { airportSchema } from "~/services/validation/airport";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { fluggastrechteFlugdatenInputSchema } from "./flugdaten/userData";
import { fluggastrechteGrundvoraussetzungenInputSchema } from "./grundvoraussetzungen/userData";
import type { FluggastrechtePersoenlicheDatenUserData } from "./persoenlicheDaten/userData";
import type { FluggastrechteProzessfuehrungUserData } from "./prozessfuehrung/userData";
import type { FluggastrechteStreitwertKostenUserData } from "./streitwertKosten/userData";

export const fluggastrechteInputSchema = {
  startAirport: schemaOrEmptyString(airportSchema),
  endAirport: schemaOrEmptyString(airportSchema),
  ...fluggastrechteFlugdatenInputSchema,
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
export type FluggastrechteUserData = z.infer<typeof _contextObject> &
  FluggastrechtePersoenlicheDatenUserData &
  FluggastrechteProzessfuehrungUserData &
  FluggastrechteStreitwertKostenUserData;
