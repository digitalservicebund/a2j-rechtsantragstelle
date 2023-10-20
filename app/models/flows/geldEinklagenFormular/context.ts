import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { emailSchema } from "~/services/validation/email";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import {
  adresse,
  namePrivatPerson,
  persoenlicheDaten,
  titleSchema,
} from "../persoenlicheDaten/context";

export const context = {
  anzahl: z.enum(["1", "2", "3"], customRequiredErrorMessage),
  ...namePrivatPerson,
  ...persoenlicheDaten,
  ...adresse,
  titel: titleSchema, //TODO: remove and replace by persoenlicheDaten.title after merge
  volljaerig: YesNoAnswer,
  strasse: inputRequiredSchema, // TODO: replace by adresse.strasseHausnummer after merge
  gesetzlicheVertretung: YesNoAnswer,
  gegenseite: z
    .object({
      typ: z.enum(["privatperson", "unternehmen"], customRequiredErrorMessage),
      privatperson: z
        .object({
          ...namePrivatPerson,
          ...persoenlicheDaten,
          ...adresse,
        })
        .partial(),
      unternehmen: z
        .object({
          name: inputRequiredSchema,
          inhaber: inputRequiredSchema,
          adresszusatz: z.string().optional(),
          ...adresse,
          ...persoenlicheDaten,
        })
        .partial(),
    })
    .partial(),
  forderung: z
    .object({
      nebenforderungen: YesNoAnswer,
      forderung1: z
        .object({
          title: inputRequiredSchema,
          betrag: buildMoneyValidationSchema(),
          beschreibung: inputRequiredSchema,
          person: z
            .object({
              ...namePrivatPerson,
              ...adresse,
              ...persoenlicheDaten,
              email: z.union([emailSchema, z.literal("")]),
            })
            .partial(),
          zeuge: z.object(namePrivatPerson).partial(),
        })
        .partial(),
      forderung2: z
        .object({
          title: inputRequiredSchema,
          betrag: buildMoneyValidationSchema(),
          beschreibung: inputRequiredSchema,
        })
        .partial(),
    })
    .partial(),
  versaeumnisurteil: YesNoAnswer,
  anmerkung: z.string(),
} as const;

const contextObject = z.object(context).partial();
export type GeldEinklagenFormularContext = z.infer<typeof contextObject>;
