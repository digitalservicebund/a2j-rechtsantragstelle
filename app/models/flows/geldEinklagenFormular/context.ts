import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";

const titleSchema = z.enum(["", "dr"]);

export const context = {
  anzahl: z.enum(["1", "2", "3"], customRequiredErrorMessage),
  titel: titleSchema,
  nachname: z.string().min(1),
  vorname: z.string().min(1),
  volljaerig: YesNoAnswer,
  strasse: z.string().min(1),
  plz: postcodeSchema,
  ort: z.string().min(1),
  telefonnummer: phoneNumberSchema,
  gesetzlicheVertretung: YesNoAnswer,
  bevollmaechtigtePerson: z.enum(
    ["lawyer", "yes", "no"],
    customRequiredErrorMessage,
  ),
  gegenseite: z
    .object({
      typ: z.enum(["privatperson", "unternehmen"], customRequiredErrorMessage),
      privatperson: z
        .object({
          title: titleSchema,
          nachname: z.string().min(1),
          vorname: z.string().min(1),
          strasseHausnummer: z.string().min(1),
          plz: postcodeSchema,
          ort: z.string().min(1),
          telefonnummer: z.string().min(1),
          bevollmaechtigtePerson: YesNoAnswer,
        })
        .partial(),
      unternehmen: z
        .object({
          title: titleSchema,
          name: z.string().min(1),
          inhaber: z.string().min(1),
          adresszusatz: z.string().min(1),
          strasseHausnummer: z.string().min(1),
          plz: postcodeSchema,
          ort: z.string().min(1),
          telefonnummer: z.string().min(1),
          bevollmaechtigtePerson: YesNoAnswer,
        })
        .partial(),
    })
    .partial(),
  forderung: z
    .object({
      nebenforderungen: YesNoAnswer,
      forderung1: z
        .object({
          title: z.string().min(1),
          betrag: buildMoneyValidationSchema(),
          beschreibung: z.string().min(1),
          person: z
            .object({
              ort: z.string().min(1),
              strasseHausnummer: z.string().min(1),
              plz: postcodeSchema,
              telefonnummer: z.string().optional(),
              email: z.string().optional(),
              title: titleSchema,
              nachname: z.string().min(1),
              vorname: z.string().min(1),
            })
            .partial(),
          zeuge: z
            .object({
              title: titleSchema,
              nachname: z.string().min(1),
              vorname: z.string().min(1),
            })
            .partial(),
        })
        .partial(),
      forderung2: z
        .object({
          title: z.string().min(1),
          betrag: buildMoneyValidationSchema(),
          beschreibung: z.string().min(1),
        })
        .partial(),
    })
    .partial(),
  versaeumnisurteil: YesNoAnswer,
  anmerkung: z.string(),
} as const;

const contextObject = z.object(context).partial();
export type GeldEinklagenFormularContext = z.infer<typeof contextObject>;
