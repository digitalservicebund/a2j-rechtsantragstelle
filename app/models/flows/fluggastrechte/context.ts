import { z } from "zod";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";

export const fluggastrechteVorabcheckContext = {
  startAirport: z.string(),
  endAirport: z.string(),
  fluggesellschaft: z.enum(["lufthansa", "ryanair"]),
  bereich: z.enum(
    ["nichtbefoerderung", "verspaetet", "annulierung", "anderes"],
    customRequiredErrorMessage,
  ),
  verspaetung: YesNoAnswer,
  checkin: YesNoAnswer,
  gruende: YesNoAnswer,
  entschaedigung: YesNoAnswer,
  gericht: YesNoAnswer,
  anwalt: YesNoAnswer,
  kostenlos: z.enum(["yesBonus", "yesOther", "no"], customRequiredErrorMessage),
  rabatt: YesNoAnswer,
  buchung: YesNoAnswer,
} as const;

const contextObject = z.object(fluggastrechteVorabcheckContext).partial();
export type FluggastrechtVorabcheckContext = z.infer<typeof contextObject>;
