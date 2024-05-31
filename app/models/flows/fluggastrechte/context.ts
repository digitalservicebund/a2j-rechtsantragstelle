import { z } from "zod";
import { airportSchema } from "~/services/validation/airport";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";

export const airlineSchema = z.enum([
  "alitalia",
  "airfrance",
  "austrianairlines",
  "britishairways",
  "lufthansa",
  "easyjet",
  "klm",
  "finnair",
  "ryanair",
  "scandinavian",
  "sonstiges",
]);

export const fluggastBereichSchema = z.enum(
  ["nichtbefoerderung", "verspaetet", "annulierung", "anderes"],
  customRequiredErrorMessage,
);

const ankuendigungSchema = z.enum([
  "no",
  "until6Days",
  "between7And13Days",
  "moreThan13Days",
]);

export const zustaendigesAmtsgerichtSchema = z.array(
  z.object({
    bezeichnung: stringOptionalSchema,
    strasseMitHausnummer: stringOptionalSchema,
    plzUndStadt: stringOptionalSchema,
  }),
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
  zustaendigesAmtsgericht: zustaendigesAmtsgerichtSchema.optional(),
  ankuendigung: ankuendigungSchema,
  ersatzflug: YesNoAnswer,
  ersatzflugStartenEinStunde: YesNoAnswer,
  ersatzflugLandenZweiStuden: YesNoAnswer,
  vertretbareGruendeAnnullierung: YesNoAnswer,
  ersatzflugStartenZweiStunden: YesNoAnswer,
  ersatzflugLandenVierStunden: YesNoAnswer,
} as const;

const contextObject = z.object(fluggastrechteVorabcheckContext).partial();
export type FluggastrechtVorabcheckContext = z.infer<typeof contextObject>;
