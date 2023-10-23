import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import {
  adresse,
  persoenlicheDaten,
  namePrivatPerson,
  titleSchema,
} from "../persoenlicheDaten/context";
import { inputRequiredSchema } from "~/services/validation/inputRequired";

export const fluggastrechtContext = {
  anzahl: z.enum(["1", "2", "3"], customRequiredErrorMessage),
  ...persoenlicheDaten,
  ...adresse,
  ...namePrivatPerson,
  titel: titleSchema, //TODO: remove and replace by persoenlicheDaten.title after merge
  strasse: inputRequiredSchema, // TODO: replace by adresse.strasseHausnummer after merge
  volljaerig: YesNoAnswer,
  gesetzlicheVertretung: YesNoAnswer,
  versaeumnisurteil: YesNoAnswer,
  anmerkung: z.string(),
} as const;

const contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof contextObject>;
