import { z } from "zod";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { airportSchema } from "~/services/validation/airport";

export const airlineSchema = z.enum(["lufthansa", "ryanair"]);
export const fluggastBereichSchema = z.enum(
  ["nichtbefoerderung", "verspaetet", "annulierung", "anderes"],
  customRequiredErrorMessage,
);

export const fluggastrechteVorabcheckContext = {
  startAirport: airportSchema,
  endAirport: airportSchema,
  fluggesellschaft: airlineSchema,
  bereich: fluggastBereichSchema,
  verspaetung: YesNoAnswer,
  checkin: YesNoAnswer,
  gruende: YesNoAnswer,
  entschaedigung: YesNoAnswer,
  gericht: YesNoAnswer,
  abtretung: YesNoAnswer,
  kostenlos: YesNoAnswer,
  rabatt: YesNoAnswer,
  buchung: YesNoAnswer,
} as const;

const contextObject = z.object(fluggastrechteVorabcheckContext).partial();
export type FluggastrechtVorabcheckContext = z.infer<typeof contextObject>;
