import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const context = {
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
  forderung: z.enum(
    ["lessOrEqual5000", "moreThan5000", "action", "moneyAndAction", "unsure"],
    customRequiredErrorMessage,
  ),
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
