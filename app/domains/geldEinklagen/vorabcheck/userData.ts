import { z } from "zod";
import { postcodeSchema } from "~/services/validation/postcode";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const geldEinklagenVorabcheckInputSchema = {
  forderung: z.enum(["money", "action", "moneyAndAction"]),
  geldspanne: z.enum([
    "below_500",
    "above_500",
    "above_1000",
    "above_1500",
    "above_2000",
    "above_3000",
    "above_4000",
    "above_5000",
    "no",
  ]),
  kontaktaufnahme: YesNoAnswer,
  fristAbgelaufen: z.enum(["yes", "notSet", "no"]),
  privatperson: z.enum([
    "yes",
    "nonPrivate",
    "nonSingle",
    "representing",
    "organisation",
  ]),
  bundIdAccount: z.enum(["yes", "wantTo", "no"]),
  bereich: z.enum([
    "work",
    "living",
    "shopping",
    "family",
    "travel",
    "tax",
    "violation",
    "other",
  ]),
  flug: YesNoAnswer,
  gegenseite: z.enum(["privatperson", "unternehmen", "multiple"]),
  gegenseitePersonDeutschland: YesNoAnswer,
  gegenseiteUnternehmenDeutschland: YesNoAnswer,
  wohnraeume: YesNoAnswer,
  wohnraumPlz: postcodeSchema,
  gegenseitePersonPlz: postcodeSchema,
  gegenseiteUnternehmenPlz: postcodeSchema,
  schadenPlz: postcodeSchema,
  ortLeistungPlz: postcodeSchema,
  gegenseiteKontakt: YesNoAnswer,
  gegenseiteFrist: YesNoAnswer,
  digitalAusweisen: z.enum([
    "yesWithId",
    "yesWithElectronicResidencePermitOrUnionCitizenCard",
    "no",
  ]),
} as const;

const _partialSchema = z.object(geldEinklagenVorabcheckInputSchema).partial();
export type GeldEinklagenVorabcheckUserData = z.infer<typeof _partialSchema>;
