import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { emailSchema } from "~/services/validation/email";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";

const titleSchema = z.enum(["", "dr"]);

export const context = {
  anzahl: z.enum(["1", "2", "3"], customRequiredErrorMessage),
  titel: titleSchema,
  nachname: inputRequiredSchema,
  vorname: inputRequiredSchema,
  volljaerig: YesNoAnswer,
  strasse: inputRequiredSchema,
  plz: inputRequiredSchema.pipe(postcodeSchema),
  ort: inputRequiredSchema,
  telefonnummer: inputRequiredSchema.pipe(phoneNumberSchema),
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
          nachname: inputRequiredSchema,
          vorname: inputRequiredSchema,
          strasseHausnummer: inputRequiredSchema,
          plz: inputRequiredSchema.pipe(postcodeSchema),
          ort: inputRequiredSchema,
          telefonnummer: inputRequiredSchema.pipe(phoneNumberSchema),
          bevollmaechtigtePerson: YesNoAnswer,
        })
        .partial(),
      unternehmen: z
        .object({
          title: titleSchema,
          name: inputRequiredSchema,
          inhaber: inputRequiredSchema,
          adresszusatz: inputRequiredSchema,
          strasseHausnummer: inputRequiredSchema,
          plz: inputRequiredSchema.pipe(postcodeSchema),
          ort: inputRequiredSchema,
          telefonnummer: inputRequiredSchema.pipe(phoneNumberSchema),
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
          title: inputRequiredSchema,
          betrag: buildMoneyValidationSchema(),
          beschreibung: inputRequiredSchema,
          person: z
            .object({
              ort: inputRequiredSchema,
              strasseHausnummer: inputRequiredSchema,
              plz: inputRequiredSchema.pipe(postcodeSchema),
              telefonnummer: z.union([phoneNumberSchema, z.literal("")]),
              email: z.union([emailSchema, z.literal("")]),
              title: titleSchema,
              nachname: inputRequiredSchema,
              vorname: inputRequiredSchema,
            })
            .partial(),
          zeuge: z
            .object({
              title: titleSchema,
              nachname: inputRequiredSchema,
              vorname: inputRequiredSchema,
            })
            .partial(),
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
