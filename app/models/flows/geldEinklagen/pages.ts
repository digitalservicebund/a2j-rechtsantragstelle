import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const context = {
  forderung: z.enum(
    ["money", "action", "moneyAndAction"],
    customRequiredErrorMessage,
  ),
  gerichtskostenvorschuss: z.enum(
    ["yes", "notPossible", "no"],
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
    ["work", "living", "shopping", "family", "travel", "other"],
    customRequiredErrorMessage,
  ),
  flug: YesNoAnswer,
  gegenseite: z.enum(
    ["privatperson", "unternehmen", "staat", "multiple"],
    customRequiredErrorMessage,
  ),
} as const;

const contextObject = z.object(context).partial();
export type GeldEinklagenVorabcheckContext = z.infer<typeof contextObject>;
