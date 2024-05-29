import { z } from "zod";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { airportSchema } from "~/services/validation/airport";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

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
  compensation: YesNoAnswer,
  compensationAccepted: YesNoAnswer,
  justifiableReasons: YesNoAnswer,
  zustaendigesAmtsgericht: zustaendigesAmtsgerichtSchema.optional(),
} as const;

const contextObject = z.object(fluggastrechteVorabcheckContext).partial();
export type FluggastrechtVorabcheckContext = z.infer<typeof contextObject>;
