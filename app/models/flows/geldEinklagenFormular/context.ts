import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { postcodeSchema } from "~/services/validation/plz";

const titleSchema = z.enum(
  ["Keine Auswahl", "Dr."],
  customRequiredErrorMessage,
);

export const context = {
  titel: titleSchema,
  nachname: z.string().min(1),
  vorname: z.string().min(1),
  geburtsdatum: z.string().min(1),
  strasse: z.string().min(1),
  plz: postcodeSchema,
  ort: z.string().min(1),
  telefonnummer: z.string().min(1),
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
          person1Title: titleSchema,
          person1Nachname: z.string().min(1),
          person1Vorname: z.string().min(1),
          person1StrasseHausnummer: z.string().min(1),
          person1Plz: postcodeSchema,
          person1Telefonnummer: z.string().optional(),
          person1Email: z.string().optional(),
          person1Ort: z.string().min(1),
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
  anmerkung: z.string().nullish(),
} as const;

const contextObject = z.object(context).partial();
export type GeldEinklagenFormularContext = z.infer<typeof contextObject>;
