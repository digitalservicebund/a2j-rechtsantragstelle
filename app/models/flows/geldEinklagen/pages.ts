import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const context = {
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
  forderung: z.enum([
    "lessOrEqual5000",
    "moreThan5000",
    "action",
    "moneyAndAction",
    "unsure",
  ]),
  bereich: z.enum(["work", "living", "shopping", "family", "travel", "other"]),
  flug: YesNoAnswer,
  gegenseite: z.enum(["privatperson", "unternehmen", "staat", "multiple"]),
  gegenseitePersonDeutschland: YesNoAnswer,
  gegenseiteUnternehmenDeutschland: YesNoAnswer,
} as const;

const contextObject = z.object(context).partial();
export type GeldEinklagenVorabcheckContext = z.infer<typeof contextObject>;
