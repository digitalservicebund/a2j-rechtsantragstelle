import { type z } from "zod";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  ankuendigungSchema,
  fluggastBereichSchema,
  type fluggastrechteVorabcheckPages,
} from "./pages";

export const fluggastrechteVorabcheckInputSchema = {
  startAirport: airportSchema,
  endAirport: airportSchema,
  fluggesellschaft: airlineSchema,
  bereich: fluggastBereichSchema,
  verspaetung: YesNoAnswer,
  verjaehrung: YesNoAnswer,
  checkin: YesNoAnswer,
  gruende: YesNoAnswer,
  entschaedigung: YesNoAnswer,
  gericht: YesNoAnswer,
  abtretung: YesNoAnswer,
  kostenlos: YesNoAnswer,
  rabatt: YesNoAnswer,
  buchung: YesNoAnswer,
  ausgleich: YesNoAnswer,
  ausgleichAngenommen: YesNoAnswer,
  vertretbareGruende: YesNoAnswer,
  ankuendigung: ankuendigungSchema,
  ersatzflug: YesNoAnswer,
  ersatzflugStartenEinStunde: YesNoAnswer,
  ersatzflugLandenZweiStunden: YesNoAnswer,
  vertretbareGruendeAnnullierung: YesNoAnswer,
  ersatzflugStartenZweiStunden: YesNoAnswer,
  ersatzflugLandenVierStunden: YesNoAnswer,
} as const;

export type FluggastrechtVorabcheckUserData = UserDataFromPagesSchema<
  typeof fluggastrechteVorabcheckPages
>;

export type FluggastrechtBereichType = z.infer<typeof fluggastBereichSchema>;
export type FluggastrechtAnkuendigungType = z.infer<typeof ankuendigungSchema>;
