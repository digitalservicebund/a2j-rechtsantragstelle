import { z } from "zod";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { fluggastrechteFlugdaten } from "./flugdaten/context";
import { fluggastrechtePersoenlichDaten } from "./persoenlicheDaten/context";
import { fluggastrechtProzessfuehrungDaten } from "./prozessfuehrung/context";
import { fluggastrechtStreitKostenDaten } from "./streitwertKosten/context";

export const fluggastrechtContext = {
  datenverarbeitungZustimmung: checkedRequired,
  startAirport: optionalOrSchema(airportSchema),
  endAirport: optionalOrSchema(airportSchema),
  fluggesellschaft: optionalOrSchema(airlineSchema),
  ...fluggastrechteFlugdaten,
  ...fluggastrechtePersoenlichDaten,
  ...fluggastrechtStreitKostenDaten,
  ...fluggastrechtProzessfuehrungDaten,
  ankuendigung: stringOptionalSchema,
  ersatzflug: stringOptionalSchema,
  ersatzflugStartenEinStunde: stringOptionalSchema,
  ersatzflugLandenZweiStunden: stringOptionalSchema,
  ersatzflugStartenZweiStunden: stringOptionalSchema,
  ersatzflugLandenVierStunden: stringOptionalSchema,
  entschaedigung: stringOptionalSchema,
} as const;

const _contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof _contextObject>;
