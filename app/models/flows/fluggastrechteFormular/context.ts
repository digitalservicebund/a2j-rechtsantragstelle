import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import {
  adresse,
  persoenlicheDaten,
  namePrivatPerson,
} from "../persoenlicheDaten/context";
import { airportSchema } from "~/services/validation/airport";
import { inputRequiredSchema } from "~/services/validation/inputRequired";

export const fluggastrechtContext = {
  zwischenstopps: YesNoAnswer,
  zwischenstoppFlughafen: z.union([airportSchema, z.literal("")]),
  ankunftsDatum: inputRequiredSchema, // TODO: validate as German date in the past
  ankunftsZeit: inputRequiredSchema,
  ankunftsFlugnummer: inputRequiredSchema,
  anzahl: z.enum(["1", "2", "3"], customRequiredErrorMessage),
  ...persoenlicheDaten,
  ...adresse,
  ...namePrivatPerson,
  volljaehrig: YesNoAnswer,
  gesetzlicheVertretung: YesNoAnswer,
  entfernung: z.coerce.number().min(1),
  teilentschaedigung: YesNoAnswer,
  ticketnummer: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{13}$/, { message: "invalid-eticketnummer" }),
  frist: z.string(), // TODO: validate as German date in the future
  nebenforderungen: YesNoAnswer,
  versaeumnisurteil: YesNoAnswer,
  anmerkung: z.string(),
} as const;

const contextObject = z.object(fluggastrechtContext).partial();
export type FluggastrechtContext = z.infer<typeof contextObject>;
