import { z } from "zod";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";

export const fluggastBereichSchema = z.enum(
  ["nichtbefoerderung", "verspaetet", "annullierung", "anderes"],
  customRequiredErrorMessage,
);

const ankuendigungSchema = z.enum(
  ["no", "until6Days", "between7And13Days", "moreThan13Days"],
  customRequiredErrorMessage,
);

export const fluggastrechteVorabcheckContext = {
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

const _contextObject = z.object(fluggastrechteVorabcheckContext).partial();
export type FluggastrechtVorabcheckContext = z.infer<typeof _contextObject>;
export type FluggastrechtBereichType = z.infer<typeof fluggastBereichSchema>;
export type FluggastrechtAnkuendigungType = z.infer<typeof ankuendigungSchema>;
