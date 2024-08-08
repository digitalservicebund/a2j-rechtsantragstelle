import { z } from "zod";
import { postcodeSchema } from "~/services/validation/postcode";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const context = {
  forderung: z.enum(
    ["money", "action", "moneyAndAction"],
    customRequiredErrorMessage,
  ),
  geldspanne: z.enum(
    [
      "below_500",
      "above_500",
      "above_1000",
      "above_1500",
      "above_2000",
      "above_3000",
      "above_4000",
      "above_5000",
      "no",
    ],
    customRequiredErrorMessage,
  ),
  kontaktaufnahme: YesNoAnswer,
  fristAbgelaufen: z.enum(["yes", "notSet", "no"], customRequiredErrorMessage),
  privatperson: z.enum(
    ["yes", "nonPrivate", "nonSingle", "representing", "organisation"],
    customRequiredErrorMessage,
  ),
  bundIdAccount: z.enum(["yes", "wantTo", "no"], customRequiredErrorMessage),
  bereich: z.enum(
    [
      "work",
      "living",
      "shopping",
      "family",
      "travel",
      "tax",
      "violation",
      "other",
    ],
    customRequiredErrorMessage,
  ),
  flug: YesNoAnswer,
  gegenseite: z.enum(
    ["privatperson", "unternehmen", "multiple"],
    customRequiredErrorMessage,
  ),
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
  digitalAusweisen: z.enum(
    ["yesWithId", "yesWithElectronicResidencePermitOrUnionCitizenCard", "no"],
    customRequiredErrorMessage,
  ),
} as const;

const _contextObject = z.object(context).partial();
export type GeldEinklagenVorabcheckContext = z.infer<typeof _contextObject>;
